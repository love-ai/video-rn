import React from "react";
import BasePage from "../base/BasePage";
import BaseComponent from "../base/BaseComponent";
import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
      modalVisible: false,
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

  delete() {
    console.log("delete");
  }

  render() {
    return (
      <BaseComponent {...this.state} retry={this.getData}>
        {this.getContentView()}
        {this.getModalView()}
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
          renderItem={({ item, index }) =>
            <VideoListItem item={item} navigation={this.props.navigation}
                           onLongPress={(videoId) => {
                             this.setState({ modalVisible: true });
                           }} />}
        />
      </View>
    );
  }

  getModalView() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>是否确认删除该视频？</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableHighlight style={styles.buttonStyle}
                                  underlayColor={Colors.C_666666}
                                  onPress={() => {
                                    this.setState({ modalVisible: false });
                                  }}>
                <Text style={styles.delete_btn}>取消</Text>
              </TouchableHighlight>
              <TouchableHighlight style={[styles.buttonStyle, { marginLeft: 15 }]}
                                  underlayColor={Colors.C_666666}
                                  onPress={() => {
                                    this.setState({ modalVisible: false });
                                    this.delete();
                                  }}>
                <Text style={styles.delete_btn}>确认</Text>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </Modal>
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonStyle: {
    height: 45,
    borderRadius: 3,
    alignItems: "center",
    backgroundColor: Colors.C_999999,
  },
  delete_btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    fontSize: 16,
    color: Colors.C_111,
  },
});
