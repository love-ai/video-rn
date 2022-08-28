import React, { PureComponent } from "react";
import { StyleSheet,View } from "react-native";
import FastImage from "react-native-fast-image";
import { StateImg } from "../../res/Images";
import { Colors } from "../../res/Colors";

export default class LoadingComponent extends PureComponent {

  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.load_anim}>
        <FastImage style={styles.loading_img} source={StateImg.state_loading_more} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  load_anim: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.C_000,
    zIndex: 10,
  },

  loading_img: {
    width: 28,
    height: 28,
  },
});

