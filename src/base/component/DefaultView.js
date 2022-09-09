import React, { PureComponent } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { Images } from "../../res/Images";
import { Colors } from "../../res/Colors";
import PropTypes from "prop-types";

export default class DefaultView extends PureComponent {

  static propTypes = {
    style: PropTypes.object,
    onPress: PropTypes.func,
    icon: PropTypes.number,
    message: PropTypes.string,
  };

  constructor() {
    super();
  }

  render() {
    return (
      <TouchableOpacity
        style={commStyle.def_view}
        activeOpacity={1}
        onPress={this.props.onPress()}
      >
        <FastImage
          style={commStyle.def_img}
          source={Images.state_empty}
          resizeMode={"stretch"}
        />
        <Text style={commStyle.def_txt}>{this.props.message}</Text>
      </TouchableOpacity>
    );
  }
}

export const commStyle = StyleSheet.create({
  def_view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.C_F4F4F4,
  },
  def_img: {
    width: 135,
    height: 135,
  },
  custom_def: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: "35%",
    backgroundColor: Colors.C_F4F4F4,
  },
  def_txt: {
    fontSize: 13,
    color: "#999999",
    marginTop: 10,
  },
});

