import React from "react";
import BasePage from "../base/BasePage";
import BaseComponent from "../base/BaseComponent";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import HttpCall from "../net/HttpCall";
import Api from "./Api";
import Toast from "react-native-root-toast";
import VideoListItem from "./view/VideoListItem";

export default class VideoListPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      isRefreshing: false,

    };
  }

  componentDidMount() {
    this.getData();
  }

  getData(isRefresh = false) {
    const { userId } = this.props.route.params;
    let params = {
      userId: userId,
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
      <BaseComponent {...this.state} >
        {this.getContentView()}
      </BaseComponent>
    );
  }

  getContentView() {
    const { data, isRefreshing } = this.state;
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
              isRefreshing={isRefreshing}
              onRefresh={() => this.getData(true)}
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
