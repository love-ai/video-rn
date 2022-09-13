import React from "react";
import BasePage from "../base/BasePage";
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import BaseComponent from "../base/BaseComponent";
import HttpCall from "../net/HttpCall";
import Api from "./Api";
import { Colors } from "../res/Colors";
import Toast from "react-native-root-toast";
import FastImage from "react-native-fast-image";
import { Images } from "../res/Images";
import { launchImageLibrary } from "react-native-image-picker";
import { isEmpty } from "../utils/ObjectUtil";
import Upload from "../utils/S3Utils";
import md5 from "md5";
import { Image } from "react-native-compressor";

export default class UploadPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      title: "",
      imgUri: "",
      videoUri: "",
      imgS3: "",
      videoS3: "",
      videoSource: "",
    };
  }

  upload() {
    const { navigation } = this.props;
    const { title, imgS3, videoS3, videoSource } = this.state;
    if (isEmpty(title)) {
      Toast.show("请填写视频名称");
      return;
    }
    if (isEmpty(imgS3)) {
      Toast.show("请完成视频封面上传");
      return;
    }
    if (isEmpty(videoS3)) {
      Toast.show("请完成视频上传");
      return;
    }
    let params = {
      title: title,
      thumbnail: imgS3,
      source_url: videoSource,
      s3_url: videoS3,
    };
    console.log(params);
    this.showLoading();
    HttpCall.post(Api.addVideo, params)
      .then((data) => {
        this.hideLoading();
        console.log(JSON.stringify(data));
        Toast.show("添加成功，转码成功后显示");
        //前往视频播放页面
        navigation.goBack();
      })
      .catch((error) => {
        this.hideLoading();
        Toast.show(error.msg);
      });
  }

  async uploadImg(uri) {

    uri = await Image.compress(uri, {
      maxWidth: 720,
      quality: 0.8,
    });
    console.log("result:" + JSON.stringify(uri));
    //上传到S3
    let fileName = uri.substring(uri.lastIndexOf("/"));
    const photoKey = encodeURIComponent("video") + fileName;
    console.log("photoKey:" + photoKey);
    this.showLoading();
    await Upload("carlwe-bucket", photoKey, uri, (res) => {
      this.hideLoading();
      Toast.show("上传成功");
      let imgUrl = "https://carlwe-bucket.s3.ap-northeast-1.amazonaws.com/" + photoKey;
      this.setState({
        imgS3: imgUrl,
      });
    }, (err) => {
      Toast.show(err);
      this.hideLoading();
    });
  }

  async uploadVideo(asserts) {
    //上传到S3
    let uri = asserts.uri;
    let fileName = md5(uri + asserts.fileSize) + ".mp4";
    const videoKey = encodeURIComponent("assets01") + "/" + fileName;
    console.log("videoKey:" + videoKey);
    this.showLoading();
    await Upload("my-video-stack-source71e471f1-jcr9upd05io8", videoKey, uri, (res) => {
      this.hideLoading();
      Toast.show("上传成功");
      this.setState({
        videoS3: "s3://my-video-stack-source71e471f1-jcr9upd05io8/" + videoKey,
        videoSource: "https://my-video-stack-source71e471f1-jcr9upd05io8.s3.ap-northeast-1.amazonaws.com/" + videoKey,
      });
    }, (err) => {
      Toast.show(err);
      this.hideLoading();
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
    const { imgUri, videoUri } = this.state;
    return <View style={styles.container}>
      <Text style={styles.text_title}>视频名称：</Text>
      <TextInput style={styles.text_input}
                 placeholder={"请输入名称"}
                 maxLength={50}
                 onChangeText={(text) => this.setState({ title: text })}
                 placeholderTextColor={Colors.C_999999} />
      <Text style={styles.text_title}>视频封面：</Text>
      <TouchableHighlight style={styles.image_out}
                          underlayColor={Colors.C_CDCDCD}
                          onPress={async () => {
                            //去相册选图
                            let options = {
                              mediaType: "photo",
                            };
                            let res = await launchImageLibrary(options);
                            if (res.assets) {
                              let uri = res.assets[0].uri;
                              await this.uploadImg(uri);
                              this.setState({
                                imgUri: uri,
                              });
                            }
                            console.log(JSON.stringify(res));
                          }}>
        <View>
          <FastImage
            style={styles.add_image_style}
            source={Images.plus}
            resizeMode={"stretch"}
          />
          <FastImage
            style={styles.image_style}
            source={{ uri: imgUri }}
            resizeMode={"cover"}
          />
        </View>

      </TouchableHighlight>

      <Text style={styles.text_title}>视频：</Text>
      <TouchableHighlight style={styles.image_out}
                          underlayColor={Colors.C_CDCDCD}
                          onPress={async () => {
                            let options = {
                              mediaType: "video",
                            };
                            let res = await launchImageLibrary(options);
                            console.log("video res:" + JSON.stringify(res));
                            if (res.assets) {
                              let uri = res.assets[0].uri;
                              await this.uploadVideo(res.assets[0]);
                              this.setState({
                                videoUri: uri,
                              });
                            }
                          }}>
        <FastImage
          style={styles.add_image_style}
          source={!isEmpty(videoUri) ? Images.play_video_grey : Images.plus}
          resizeMode={"stretch"}
        />
      </TouchableHighlight>

      <TouchableHighlight style={styles.submitActionStyle}
                          underlayColor={Colors.C_666666}
                          onPress={() => {
                            this.upload();
                          }}>
        <Text style={styles.submit_btn}>提交</Text>
      </TouchableHighlight>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "5%",
    marginHorizontal: 18,
  },
  text_title: {
    fontSize: 15,
    color: Colors.black,
    marginTop: 18,
    paddingBottom: 8,
  },
  image_out: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: Colors.C_CDCDCD,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  image_style: {
    position: "absolute",
    marginLeft: -20,
    marginTop: -20,
    width: 70,
    height: 70,
  },
  add_image_style: {
    width: 30,
    height: 30,
  },
  progress: {
    marginTop: 10,
  },
  text_input: {
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.C_161616,
    borderRadius: 3,
  },
  submitActionStyle: {
    height: 45,
    marginTop: 28,
    borderRadius: 3,
    alignItems: "center",
    backgroundColor: Colors.C_999999,
  },

  submit_btn: {
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
