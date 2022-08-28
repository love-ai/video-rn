import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../../res/Colors";

export default class NavigationBar extends Component {
  static propTypes = {
    title: PropTypes.string,
    navBarBgColor: PropTypes.string,
  };

  static defaultProps = {
    title: "",
    navBarBgColor: Colors.white,
  };

  constructor(props) {
    super(props);
  }

  // 导航中部title
  _navCenterTitleView() {
    return (
      <View style={styles.centerItemView}>
        <Text style={styles.title} numberOfLines={1}>
          {this.props.title}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View
        style={[
          styles.header_view,
          { backgroundColor: this.props.navBarBgColor },
        ]}
      >
        <View style={styles.nav_view}>
          {this._navCenterTitleView()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_view: {
    paddingTop: Platform.OS === "ios" ? 44 : 0,
    zIndex: 100,
  },
  nav_view: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
  },
  centerItemView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 60,
    right: 60,
    height: 44,
  },
  title: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.black,
  },
});
