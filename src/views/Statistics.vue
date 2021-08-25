<!--  -->
<template>
  <div class="wrap">
    <div class="header">
      <div class="date-wrap">
        <div @click="showDay = true" class="time">
          {{formatMonth(currentTime)}}
          <van-icon name="arrow-down" />
        </div>
        <div class="title">
          账单统计
        </div>
      </div>
      <div class="data-wrap">
        <span>总支出￥{{totalExpense.toFixed(2)}}</span>
        <span style="margin-left: 10px">总收入￥{{totalIncome.toFixed(2)}}</span>
      </div>
    </div>
    <div class="makeup">
      <div class="makeupHead">
        <div class="makeupType">
          <div @click="changeMakeupType(0)" :class="{income: true, active: makeupChartType == 0}">收入</div>
          <div @click="changeMakeupType(1)" :class="{expense: true, active: makeupChartType == 1}">支出</div>
        </div>
        <div class="makeupTitle">收支构成</div>
      </div>
      <div id="makeupChart">
      </div>
    </div>
    <div class="trend">
      <div class="trendHead">
        <div class="trendType">
          <div @click="changeTrendType(0)" :class="{income: true, active: trendChartType == 0}">收入</div>
          <div @click="changeTrendType(1)" :class="{expense: true, active: trendChartType == 1}">支出</div>
        </div>
        <div class="trendTitle">收支趋势</div>
      </div>
      <div id="trendChart"></div>
    </div>
    <van-popup v-model:show="showDay" position="bottom" round :style="{height: '45%'}">
      <van-datetime-picker
        v-model="currentTime"
        type="year-month"
        title="选择年月"
        @confirm="chooseDay"
        @cancel="showDay = false"
      />
    </van-popup>
  </div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
import Highmaps from "highcharts/modules/map";
import { onMounted, reactive, toRefs } from "@vue/runtime-core";
import { formatMonth } from "@/utils/formatDate";
import getDateNum from "@/utils/getDateNum";
import { get } from "@/utils/request";

HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);

export default {
  name: "Statistics",
  components: {},
  setup(){
    const state = reactive({
      showDay: false,
      currentTime: new Date(),
      trendChartTime: new Date(),
      totalExpense: 0,
      totalIncome: 0,
      makeupChartType: 1,
      trendChartType: 1,
      expenseCategoryList: [],
      incomeCategoryList: [],
      expenseTrendList: [],
      incomeTrendList: [],
    });
    
    const chooseDay = async (value) => {
      state.currentTime = value
      await getData()
      makeupChart();
      trendChart();
      state.showDay = false
    }

    const getData = async () => {
      state.expenseTrendList = new Array(getDateNum(formatMonth(state.currentTime))).fill(0)
      state.incomeTrendList = new Array(getDateNum(formatMonth(state.currentTime))).fill(0)
      state.trendChartTime = [state.currentTime.getFullYear(), state.currentTime.getMonth(), 1]
      let params = {
        date: formatMonth(state.currentTime),
      };
      let data1 = await get(
        "https://qcz8mn.fn.thelarkcloud.com/queryByMonthReturnCategory",
        params
      );
      let data2 = await get(
        "https://qcz8mn.fn.thelarkcloud.com/queryBillByMonth",
        params
      );
      
      console.log("data1", data1);
      console.log("data2", data2);

      //以下用来计算用于绘制makeupChart图表的数据
      state.expenseCategoryList = data1.data
        .filter((item) => {
          return item.judge.type == '1'
        });
      state.expenseCategoryList = state.expenseCategoryList
        .map((item) => {
          let cal = item.bills.reduce((total, cur) => {
            return total + cur.num
          }, 0)
          return [item.judge.category, cal]
        })
        .sort((a, b) => {
          return b[1] - a[1]
        })
      state.incomeCategoryList = data1.data
        .filter((item) => {
          return item.judge.type == '0'
        });
      state.incomeCategoryList = state.incomeCategoryList
        .map((item) => {
          let cal = item.bills.reduce((total, cur) => {
            return total + cur.num
          }, 0)
          return [item.judge.category, cal]
        })
        .sort((a, b) => {
          return b[1] - a[1]
        })

      //以下用来计算用于绘制trendChart图表的数据
      data2.data.sort((a, b) => {
        return parseInt(a.time.slice(-2)) > parseInt(b.time.slice(-2)) ? -1 : 1;
      });

      state.totalExpense = data2.data.reduce((total, cur) => {
        return total + cur.bills.filter((item) => {
          return item.type == '1'
        }).reduce((pre, c) => {
          return pre + c.num
        }, 0)
      }, 0)
      state.totalIncome = data2.data.reduce((total, cur) => {
        return total + cur.bills.filter((item) => {
          return item.type == '0'
        }).reduce((pre, c) => {
          return pre + c.num
        }, 0)
      }, 0)

      data2.data.map((item) => {
        let index = parseInt(item.time.slice(-2))-1
        let expense = item.bills
          .filter((t) => {
            return t.type == 1
          })
          .reduce((total, cur) => {
            return total + cur.num
          }, 0)
        let income = item.bills
          .filter((t) => {
            return t.type == 0
          })
          .reduce((total, cur) => {
            return total + cur.num
          }, 0)
      
        state.expenseTrendList[index] = expense
        state.incomeTrendList[index] = income
      })
      // state.incomeList = data.map((item) => {
      //   return item.bills.filter((t) => {
      //     return t.type == "0";
      //   });
      // });
      console.log('expenseCategoryList', state.expenseCategoryList);
      console.log('incomeCategoryList', state.incomeCategoryList);
      // console.log("expenseList", state.expenseList);
      // console.log("incomeList", state.incomeList);
      // state.expenseList = data
      // state.incomeList =
      // calcTotal()
    };

    const changeMakeupType = (type) => {
      state.makeupChartType = type
      makeupChart()
      // console.log('state.payType', state.payType);
    }
    const changeTrendType = (type) => {
      state.trendChartType = type
      trendChart()
      // console.log('state.payType', state.payType);
    }

    onMounted(async () => {
      await getData();
      makeupChart();
      trendChart();
    });
    const makeupChart = () => {
      let makeupChart = Highcharts.chart("makeupChart", {
        chart:{
          height: 200,
        },
        credits:{
          enabled: false,
        },
        title: {
          text: "",
          align: "center",
          y: 0,
        },
        tooltip: {
          headerFormat: "{series.name}<br>",
          pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>",
        },
        legend: {
          layout: "vertical",
          align: "center",
          verticalAlign: "top",
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: 30,
              style: {
                fontWeight: "bold",
                color: "black",
              },
            },
            startAngle: -90, // 圆环的开始角度
            endAngle: 90, // 圆环的结束角度
            center: ["50%", "90%"],
          },
          series: {
              dataLabels: {
              enabled: true,
              format: '{point.name}:￥{point.y:.2f}<br/><span style="color: gray;">{point.percentage:.2f}%</span>'
            }
          },
        },
        series: [
          {
            type: "pie",
            name: "收支构成",
            innerSize: "50%",
            data: state.makeupChartType == 1 ? state.expenseCategoryList : state.incomeCategoryList,
          },
        ],
      });
    };

    const trendChart = () => {
      let trendChart = new Highcharts.Chart("trendChart", {
        chart:{
          zoomType: 'x',
          height: 350,
        },
        title: {
          text: "",
        },
        credits:{
          enabled: false,
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            day: '%m-%d'
          }
        },
        yAxis: {
          title: {
            text: "金额（元）",
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            pointStart: Date.UTC(...state.trendChartTime), // 开始值
			      pointInterval: 24 * 3600 * 1000, // 间隔一天
          },
        },
        series: [
          {
            type: 'area',
            name: "收支趋势",
            data: state.trendChartType == 1 ? state.expenseTrendList : state.incomeTrendList,
          },
        ],
        tooltip: {
          pointFormat: "<span style=\"color:{point.color}\">●</span> 金额: <b>{point.y:.2f}</b><br/>",
          valueSuffix: ' 元',
          shared: true,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      });
      console.log('trendChart', trendChart);
    };

    return {
      ...toRefs(state),
      chooseDay,
      changeMakeupType,
      changeTrendType,
      formatMonth,
    };
  },
};
</script>

<style lang='less' scoped>
@blue1: rgb(28, 85, 240);
.wrap {
  width: 100%;
  height: 100%;
  .header{
    display: flex;
    flex-direction: column;
    width: 100%;
    color: #f5f5f5;
    background-color: @blue1;
    margin-bottom: 10px;
    .date-wrap{
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      .time{
        width: 80px;
        height: 30px;
        background: @blue1;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        margin: 15px 20px 0 -10px;
        border: 1px solid white;
        border-radius: 5px;
      }
      .title{
        flex-grow: 1;
        text-align: left;
        font-size: 18px;
        margin: 20px 0 0 20px;
      }
    }
    .data-wrap{
      font-size: 15px;
      text-align: left;
      margin: 10px 0 0 20px;
      span{
        margin: 0 10px 0 0;
      }
    }
    
  }
  .makeup {
    margin-bottom: 10px;
    background: white;
    .makeupHead{
      padding-top: 10px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      height: 50px;
      .makeupType {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        div {
          width: 50px;
          height: 32px;
          line-height: 32px;
          background: aliceblue;
          border: 1px solid #f5f5f5;
          border-radius: 5px;
        }
        .income{
          margin: 0 20px 0 0;
        }
        .expense{
          margin: 0 10px 0 0;
        }
        .active{
          border-color: @blue1;
          background-color: @blue1;
          color: #f5f5f5;
        }
      }
      .makeupTitle{
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        padding: 0 0 0 55px;
        flex-grow: 1;
      }
      
    }
  }
  .trend {
    margin-bottom: 100px;
    background: white;
    .trendHead{
      padding-top: 10px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      height: 50px;
      .trendType {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        div {
          width: 50px;
          height: 32px;
          line-height: 32px;
          background: aliceblue;
          border: 1px solid #f5f5f5;
          border-radius: 5px;
        }
        .income{
          margin: 0 20px 0 0;
        }
        .expense{
          margin: 0 10px 0 0;
        }
        .active{
          border-color: @blue1;
          background-color: @blue1;
          color: #f5f5f5;
        }
      }
      .trendTitle{
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        padding: 0 0 0 55px;
        flex-grow: 1;
      }
      
    }
  }
}
</style>