import React from "react";
import BasePage from "../base/BasePage";
import { Text, View } from "react-native";
import BaseComponent from "../base/BaseComponent";
import { Colors } from "../res/Colors";
import HttpCall from "../net/HttpCall";
import Api from "./Api";


export default class LoginPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      title: "登录",
    };
  }

  componentDidMount() {
    let params = {
      name: "from rn",
      mobile: 13603345345,
    };
    HttpCall.post(Api.addUser, params)
      .then(async (data) => {
        this.showContent(data, { isRefreshing: false });
      })
      .catch((error) => {
        this.setState({ isRefreshing: false });
      });
  }

  render() {
    return (
      <BaseComponent {...this.state} >
        {this.getContentView()}
      </BaseComponent>
    );
  }

  getContentView() {
    const { res } = this.state.data;
    return <View style={{ flex: 1 }}>
      <Text style={{ color: Colors.black }}>{res}</Text>
    </View>;
  }
}
