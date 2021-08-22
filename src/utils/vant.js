import {
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Button,
  Picker,
  Icon,
  List,
  Cell,
  PullRefresh,
  CellGroup,
  Popup,
  DatetimePicker,
  NumberKeyboard,
  Dialog,
  NavBar,
  Rate,
  Collapse,
  CollapseItem,
  Tag,
  DropdownMenu,
  DropdownItem
} from 'vant'
let components = [
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Button,
  Picker,
  Icon,
  List,
  PullRefresh,
  Cell,
  CellGroup,
  Popup,
  DatetimePicker,
  NumberKeyboard,
  Dialog,
  NavBar,
  Rate,
  Collapse,
  CollapseItem,
  Tag,
  DropdownMenu,
  DropdownItem
]
export default function registerVant(app) {
  components.map((v) => {
    app.use(v)
  })
}