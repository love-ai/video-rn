import React from "react";
import BasePage from "../base/BasePage";
import { Text, View } from "react-native";
import BaseComponent from "../base/BaseComponent";
import { Colors } from "../res/Colors";


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
  }

  render() {
    return (
      <BaseComponent {...this.state} >
        {this.getContentView()}
      </BaseComponent>
    );
  }

  getContentView() {
    return <View style={{ flex: 1 }}>
      <Text style={{color:Colors.black}}>Login Page</Text>
    </View>;
  }
}
