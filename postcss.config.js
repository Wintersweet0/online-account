module.exports = {
  plugins: {
      autoprefixer: {},
      "postcss-px2rem": {
          remUnit: 37.5, // 设计图为750 * height
          remPrecision: 2 // rem的小数点后位数
      }
  }
};