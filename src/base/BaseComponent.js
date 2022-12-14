import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import LoadingComponent from "./component/LoadingComponent";
import { Images } from "../res/Images";
import PermissionComponent from "./component/PermissionComponent";
import DefaultView from "./component/DefaultView";
import { Colors } from "../res/Colors";
import { Strings } from "../res/Strings";

export default class BaseComponent extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    isEmpty: PropTypes.bool,
    isError: PropTypes.bool,
    hasPermission: PropTypes.bool,
    errorText: PropTypes.string,
    errorImage: PropTypes.number,
    retry: PropTypes.func,
    backgroundColor: PropTypes.string,
    navBarBgColor: PropTypes.string,
    defaultViewStyle: PropTypes.object,
  };

  static defaultProps = {
    loading: true, // 进入页面 是否进行网络请求，默认请求
    isEmpty: false, // 当前页面无数据
    isError: false, // 当前页面出现错误
    hasPermission: true, // 当前页面是否有权限 默认有
    errorText: Strings.state_retry_txt,
    errorImage: Images.state_net_error,
    retry: () => {
    }, // 网络错误重试函数
    backgroundColor: Colors.C_F4F4F4,
    navBarBgColor: Colors.C_F4F4F4,
    defaultViewStyle: {},
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
  }

  /**
   * 导航条栏
   * @private
   */
  renderNavBar() {
    const { leftPress, navigation, ...reset } = this.props;
    return <NavigationBar leftPress={() => leftPress(navigation)} {...reset} />;
  }


  render() {
    const {
      loading,
      backgroundColor,
    } = this.props;
    //判断是新展示错误或者新展示空白页 则 不展示loading
    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        {this.renderContentView()}
        {loading && <LoadingComponent />}
      </View>

    );
  }

  /**
   * 内容页
   * @private
   */
  renderContentView() {
    const {
      isEmpty,
      isError,
      retry,
      hasPermission,
      children,
      defaultViewStyle,
    } = this.props;
    let defaultView;
    if (isEmpty) {
      defaultView = <DefaultView style={defaultViewStyle} />;
    } else if (isError) {
      // 请求错误
      defaultView = (
        <DefaultView
          onPress={retry}
          message={Strings.state_retry_txt}
          icon={Images.state_net_error}
        />
      );
    } else if (!hasPermission) {
      defaultView = <PermissionComponent {...this.props} />;
    } else {
      defaultView = children;
    }
    return defaultView;
  }


  componentWillUnmount() {
  }
}
