import React from "react";
import BasePage from "../base/BasePage";
import BaseComponent from "../base/BaseComponent";
import { StyleSheet } from "react-native";
import { Colors } from "../res/Colors";
import VideoPlayer from "react-native-video-controls";

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
    const { hls_url } = this.props.route.params;
    console.log("hls_url:" + hls_url);
    return (
      <VideoPlayer
        source={{ uri: hls_url }}
        disableFullscreen={true}
        disableVolume={true}
        navigator={this.props.navigation}
        style={styles.backgroundVideo}
      />
    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.black,
  },
});
