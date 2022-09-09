import React from "react";
import BasePage from "../base/BasePage";
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import BaseComponent from "../base/BaseComponent";
import HttpCall from "../net/HttpCall";
import Api from "./Api";
import { Colors } from "../res/Colors";
import md5 from "md5";
import Toast from "react-native-root-toast";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export default class ModifyPasswordPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      showNavBar: false,
      mobile: "",
      password: "",
      newPassword: "",
      newPasswordConfirm: "",
    };
  }

  modify() {
    const { mobile, password, newPassword, newPasswordConfirm } = this.state;
    if (mobile.length < 11) {
      Toast.show("请输入正确的手机号");
      return;
    }
    if (newPassword.length < 6) {
      Toast.show("密码最少6位长度");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      Toast.show("两次输入密码不一致");
      return;
    }
    this.showLoading();
    const { navigation } = this.props;
    let params = {
      mobile: mobile,
      password: md5(password),
      newPassword: md5(newPassword),
    };
    console.log(params);
    HttpCall.post(Api.modifyPassword, params)
      .then((data) => {
        this.hideLoading();
        console.log(JSON.stringify(data));
        Toast.show("修改成功请登陆");
        //前往视频播放页面
        navigation.goBack();
      })
      .catch((error) => {
        this.hideLoading();
        Toast.show(error.msg);
        console.log(error.msg);
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
      <TextInput style={[styles.text_input, { marginTop: 10 }]}
                 placeholder={"请输入原密码"}
                 secureTextEntry={true}
                 onChangeText={(text) => this.setState({ password: text })}
                 placeholderTextColor={Colors.C_999999} />
      <TextInput style={[styles.text_input, { marginTop: 10 }]}
                 placeholder={"请输入新密码"}
                 secureTextEntry={true}
                 onChangeText={(text) => this.setState({ newPassword: text })}
                 placeholderTextColor={Colors.C_999999} />
      <TextInput style={[styles.text_input, { marginTop: 10, marginBottom: 20 }]}
                 placeholder={"请确认新密码"}
                 secureTextEntry={true}
                 onChangeText={(text) => this.setState({ newPasswordConfirm: text })}
                 placeholderTextColor={Colors.C_999999} />
      <TouchableHighlight style={styles.loginActionStyle}
                          underlayColor={Colors.C_666666}
                          onPress={() => {
                            this.modify();
                          }}>
        <Text style={styles.login_btn}>确认修改</Text>
      </TouchableHighlight>

    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "35%",
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
