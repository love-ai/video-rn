import React from "react";
import BasePage from "../base/BasePage";
import { Dimensions, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import BaseComponent from "../base/BaseComponent";
import HttpCall from "../net/HttpCall";
import Api from "./Api";
import { Colors } from "../res/Colors";
import Toast from "react-native-root-toast";
import FastImage from "react-native-fast-image";
import { Images } from "../res/Images";
import { launchImageLibrary } from "react-native-image-picker";
import { isEmpty } from "../utils/ObjectUtil";
import * as Progress from "react-native-progress";
import UploadFile from "../utils/S3Util";

const progressWidth = Dimensions.get("window").width - 40;

export default class UploadPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      title: "",
      imgUri: "",
      videoUri: "",
      imgProgress: 0,
      uploadingImg: false,
      uploadingVideo: false,
      imgS3: "",
      videoS3: "",
      videoSource: "",
    };
  }

  upload() {
    const { mobile, password } = this.state;
    if (mobile.length < 11) {
      Toast.show("请输入正确的手机号");
      return;
    }
    this.showLoading();
    const { navigation } = this.props;
    const { title, imgS3, videoS3, videoSource } = this.state;
    let params = {
      title: title,
      thumbnail: imgS3,
      source_url: videoSource,
      s3_url: videoS3,
    };
    console.log(params);
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
    //上传到S3
    // let fileName = getUuid() + ".mp4";
    let fileName = uri.substring(uri.lastIndexOf("/"));
    const photoKey = encodeURIComponent("video") + fileName;
    console.log("photoKey:" + photoKey);
    await UploadFile("carlwe-bucket", photoKey, uri, (percent) => {
      if (percent === 1) {
        setTimeout(() => {
          this.setState({
            uploadingImg: false,
            imgProgress: 0,
          });
        }, 1000);
      }
      this.setState({
        uploadingImg: true,
        imgProgress: percent,
      });
    }, (res) => {
      this.setState({
        imgS3: res,
      });
    });
    console.log("res");
  }

  hideProgress() {

  }

  render() {
    return (
      <BaseComponent {...this.state} >
        {this.getContentView()}
      </BaseComponent>
    );
  }

  getContentView() {
    const { imgUri, videoUri, uploadingImg, uploadingVideo, imgProgress } = this.state;
    return <View style={styles.container}>
      <Text style={styles.text_title}>视频名称：</Text>
      <TextInput style={styles.text_input}
                 placeholder={"请输入名称"}
                 keyboardType={"number-pad"}
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
                            console.log("res:" + JSON.stringify(res));
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
            resizeMode={"center"}
          />
          <FastImage
            style={styles.image_style}
            source={{ uri: imgUri }}
            resizeMode={"cover"}
          />
        </View>

      </TouchableHighlight>
      {uploadingImg && <Progress.Bar
        progress={imgProgress}
        width={progressWidth}
        color={Colors.C_999999}
        style={styles.progress} />}


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
                              await this.uploadImg(uri);
                              this.setState({
                                videoUri: uri,
                              });
                            }
                          }}>
        <FastImage
          style={styles.add_image_style}
          source={!isEmpty(videoUri) ? Images.play_video : Images.plus}
          resizeMode={"center"}
        />
      </TouchableHighlight>


      {uploadingVideo && <Progress.Bar
        progress={0.1}
        width={progressWidth}
        color={Colors.C_161616}
        style={styles.progress} />}


      <TouchableHighlight style={styles.submitActionStyle}
                          underlayColor={Colors.C_666666}
                          onPress={() => {
                            this.login();
                          }}>
        <Text style={styles.login_btn}>提交</Text>
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
    marginTop: 12,
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
    marginTop: 20,
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
