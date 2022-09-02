import React from "react";
import BasePage from "../base/BasePage";
import BaseComponent from "../base/BaseComponent";
import { StyleSheet, View } from "react-native";

export default class VideoListPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
    // const { hls_url } = this.props.route.hls_url;
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
