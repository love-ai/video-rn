import { Component } from "react";
import { isEmpty } from "../utils/ObjectUtil";

export default class BasePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isError: false,
      isEmpty: false,
      hasPermission: true,
    };
    this.addNavigationListener();
  }

  addNavigationListener() {
    if (this.props.route) {
      this.unSubscribeFocus = this.props.navigation.addListener("focus", () =>
        this.onResume(),
      );
    }
  }


  //react-navigation onFocus native onResume
  onResume() {
  }


  componentWillUnmount() {
    this.unSubscribeFocus && this.unSubscribeFocus();
    this.onDestroy();
  }

  onDestroy() {
  }

  /**
   * 处理state
   */
  setData(mData) {
    this.setState({
      data: mData,
    });
  }

  showLoading() {
    this.setState({
      loading: true,
    });
  }

  hideLoading() {
    this.setState({
      loading: false,
    });
  }

  showContent(mData, param = {}) {
    if (mData) {
      this.setState({
        loading: false,
        hasPermission: true,
        isError: false,
        isEmpty: false,
        data: mData,
        ...param,
      });
    } else {
      this.setState({
        loading: false,
        hasPermission: true,
        isError: false,
        isEmpty: false,
        ...param,
      });
    }
  }

  /**
   * 展示错误 包含无权限和网络请求出错
   * @param error
   */
  showError(error = undefined) {
    if (!isEmpty(error) && (error.code === 1002)) {//无权限
      this.setState({
        hasPermission: false,
        isError: false,
        isEmpty: false,
        loading: false,
      });
    } else {
      this.setState({
        hasPermission: true,
        isError: true,
        isEmpty: false,
        loading: false,
      });
    }
  }

  showEmpty() {
    this.setState({
      hasPermission: true,
      isEmpty: true,
      loading: false,
      isError: false,
    });
  }
}
