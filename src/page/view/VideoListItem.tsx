// @ts-ignore
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Images } from "../../res/Images";
import { Colors } from "../../res/Colors";
import HttpCall from "../../net/HttpCall";
import Api from "../Api";
import Toast from "react-native-root-toast";
import { getUserId } from "../../utils/KvUtil";
import { MMKV } from "react-native-mmkv";
import { dateFormat } from "../../utils/DateUtil";

const storage = new MMKV();
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
  let [likeType, setLikeType] = useState(item.like_type);//0无点赞 1喜欢 2不喜欢
  if (likeType != item.like_type) {
    setLikeType(item.like_type);
  }

  function changeLike(isClickLike) {
    let userName = storage.getString("userName");
    let eventName = isClickLike ? "Like" : "Unlike";
    let lastLoginTime = storage.getString("lastLoginTime");
    let eventTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
    let info = {
      "candidate": "zhuxiaowei",
      "userId": getUserId(),
      "mobileType": Platform.OS,
      "userName": userName,
      "videoId": item.id + "",
      "eventName": eventName,
      "lastLogin": lastLoginTime,
      "eventTime": eventTime
    };
    console.log("info:" + JSON.stringify(info));
    sendInfo(info);
    if (isClickLike) {
      if (likeType === 1) {
        changeType(0);
      } else {
        changeType(1);
      }
    } else {
      if (likeType == 2) {
        changeType(0);
      } else {
        changeType(2);
      }
    }
  }

  function sendInfo(info) {
    let host = "https://x48usp9m8e.execute-api.us-east-2.amazonaws.com";
    HttpCall.post(host + Api.info, info)
      .then((data) => {
        console.log("send info success");
      })
      .catch((error) => {
        console.log("send info error");
      });
  }

  function changeType(likeType) {
    item.like_type = likeType;
    setLikeType(likeType);
    let param = {
      "user_id": getUserId(),
      "video_id": item.id,
      "like_type": likeType
    };
    //网络请求更新
    HttpCall.post(Api.sendInfo, param)
      .then((data) => {
        console.log("操作成功");
      })
      .catch((error) => {
        Toast.show(error.msg);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
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
          <TouchableWithoutFeedback
            onPress={() => {
              changeLike(true);
            }}>
            <View style={styles.click_padding}>
              <FastImage style={styles.like_icon} source={likeType === 1 ? Images.like_checked : Images.like}
                         resizeMode={"stretch"} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              changeLike(false);
            }}>
            <View style={styles.click_padding}>
              <FastImage style={styles.like_icon} source={likeType === 2 ? Images.unlike_checked : Images.unlike}
                         resizeMode={"stretch"} />
            </View>
          </TouchableWithoutFeedback>
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
    maxWidth: videoWidth - 90,
    color: Colors.C_161616
  },
  like_container: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  click_padding: {
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  like_icon: {
    width: 20,
    height: 20
  }
});

