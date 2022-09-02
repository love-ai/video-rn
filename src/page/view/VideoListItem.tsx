// @ts-ignore
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Images } from "../../res/Images";
import { Colors } from "../../res/Colors";

const videoHeight = Dimensions.get("window").width * 9 / 16;
const videoWidth = Dimensions.get("window").width - 20;
/**
 * 达人广场item
 */

type Props = {
  item: any;
  navigation: any;
};

export default function VideoListItem({ item, navigation }: Props) {
  console.log(JSON.stringify(item));
  return (

    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          console.log("123");
          navigation.navigate("VideoPlayPage", {
            hls_url: item.hls_url
          });
        }}>
        <View>
          <FastImage style={styles.thumbnail} source={{ uri: item.thumbnail }} />
          <View style={styles.play_container}>
            <FastImage style={styles.play} source={Images.play_video} resizeMode={"stretch"} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bottom_container}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.like_container}>
          <FastImage style={styles.like_icon} source={Images.like} resizeMode={"stretch"} />
          <FastImage style={styles.like_icon} source={Images.unlike} resizeMode={"stretch"} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: Colors.white,
    borderRadius: 5
  },
  play_container: {
    flex: 1,
    position: "absolute",
    width: videoWidth,
    height: videoHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  thumbnail: {
    flex: 1,
    height: videoHeight,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  play: {
    width: 50,
    height: 50,
    alignItems: "center"
  },
  bottom_container: {
    padding: 8,
    height: 60,
    alignItems: "center",
    flexDirection: "row"
  },
  title: {
    fontSize: 13,
    numberOfLines: 2,
    maxWidth: videoWidth - 80,
    color: Colors.C_161616
  },
  like_container: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  like_icon: {
    width: 20,
    height: 20,
    marginLeft: 10
  }
});

