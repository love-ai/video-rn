import React from "react";
import BasePage from "../base/BasePage";
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import BaseComponent from "../base/BaseComponent";
import HttpCall from "../net/HttpCall";
import Api from "./Api";
import { Colors } from "../res/Colors";
import md5 from "md5";


export default class LoginPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      showNavBar: false,
      mobile: "",
      password: "",
    };
  }

  login() {
    this.showLoading();
    const { mobile, password } = this.state;
    let params = {
      mobile: mobile,
      password: md5(password),
    };
    console.log(params);
    HttpCall.post(Api.login, params)
      .then(async (data) => {
        console.log(JSON.stringify(data));
        this.hideLoading();
      })
      .catch((error) => {
        console.log(error.msg);
        this.hideLoading();
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
    return <View style={styles.container}>
      <TextInput style={styles.text_input}
                 placeholder={"请输入手机号"}
                 keyboardType={"number-pad"}
                 onChangeText={(text) => this.setState({ mobile: text })}
                 placeholderTextColor={Colors.C_999999} />
      <TextInput style={[styles.text_input, { marginTop: 10, marginBottom: 10 }]}
                 placeholder={"请输入密码"}
                 secureTextEntry={true}
                 onChangeText={(text) => this.setState({ password: text })}
                 placeholderTextColor={Colors.C_999999} />
      <TouchableHighlight style={styles.loginActionStyle}
                          underlayColor={Colors.C_666666}
                          onPress={() => {
                            this.login();
                          }}>
        <Text style={styles.login_btn}>登录</Text>
      </TouchableHighlight>

    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "50%",
    marginHorizontal: 18,
  },

  text_input: {
    height: 45,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.C_666666,
    borderRadius: 3,
  },
  loginActionStyle: {
    height: 45,
    borderRadius: 3,
    alignItems: "center",
    backgroundColor: Colors.C_999999,
  },

  login_btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    fontSize: 16,
    color: Colors.C_111,
  },
});
