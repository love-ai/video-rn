import React from "react";
import BasePage from "../base/BasePage";
import BaseComponent from "../base/BaseComponent";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import HttpCall from "../net/HttpCall";
import Api from "./Api";
import Toast from "react-native-root-toast";
import VideoListItem from "./view/VideoListItem";
import { MMKV } from "react-native-mmkv";
import { Colors } from "../res/Colors";
import { getUserId } from "../utils/KvUtil";

const storage = new MMKV();

export default class VideoListPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      isRefreshing: false,
    };
  }

  onResume() {
    const { navigation } = this.props;
    let userType = storage.getString("userType");
    let isLogin = storage.getBoolean("isLogin");
    navigation.setOptions({
      headerLeft: () => (
        userType === "2" && (
          <TouchableWithoutFeedback onPress={() => {
            navigation.navigate("UploadPage");
          }}>
            <Text style={{ color: Colors.C_999999 }}>上传</Text>
          </TouchableWithoutFeedback>)),
    });
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => {
          if (isLogin) {
            storage.set("userId", "");
            storage.set("userType", "");
            storage.set("isLogin", false);
            Toast.show("已退出");
          }
          navigation.navigate("LoginPage");
        }}>
          <Text style={{ color: Colors.C_999999 }}>{isLogin ? "退出" : "登录"}</Text>
        </TouchableWithoutFeedback>),
    });
    this.getData();
  }


  getData() {
    let params = {
      userId: getUserId(),
    };
    // 请求网络
    HttpCall.get(Api.getVideoList, params)
      .then((data) => {
        this.showContent(data, { isRefreshing: false });
      })
      .catch((error) => {
        Toast.show(error.msg);
        this.setState({ isRefreshing: false });
        this.showError(error);
      });
  }


  render() {
    return (
      <BaseComponent {...this.state} retry={this.getData}>
        {this.getContentView()}
      </BaseComponent>
    );
  }

  getContentView() {
    const { data, isRefreshing } = this.state;
    console.log("data:" + JSON.stringify(data));
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.container}
          data={data.videoList}
          extraData={this.state}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flat_list_container}
          keyExtractor={(item, index) => `${index}`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => this.getData()}
            />
          }
          renderItem={({ item, index }) => <VideoListItem item={item} navigation={this.props.navigation} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flat_list_container: {
    paddingBottom: 60,
    paddingTop: 5,
  },
});
