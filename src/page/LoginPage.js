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

export default class LoginPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      mobile: "",
      password: "",
    };
  }

  login() {
    const { mobile, password } = this.state;
    if (mobile.length < 11) {
      Toast.show("请输入正确的手机号");
      return;
    }
    this.showLoading();
    const { navigation } = this.props;
    let params = {
      mobile: mobile,
      password: md5(password),
    };
    console.log(params);
    HttpCall.post(Api.login, params)
      .then((data) => {
        this.hideLoading();
        console.log(JSON.stringify(data));
        Toast.show("登陆成功");
        let userId = data.user.id;
        storage.set("userId", userId + "");
        storage.set("userType", data.user.user_type + "");
        storage.set("isLogin", true);
        //前往视频播放页面
        navigation.navigate("VideoListPage", {
          userId: userId,
        });
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
      <TouchableHighlight style={styles.modifyActionStyle}
                          underlayColor={Colors.C_666666}
                          onPress={() => {
                            this.props.navigation.navigate("ModifyPasswordPage");
                          }}>
        <Text style={styles.modify_btn}>修改密码</Text>
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
  modifyActionStyle: {
    height: 36,
    width: 64,
    borderRadius: 3,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  modify_btn: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    color: Colors.C_111,
  },
});
