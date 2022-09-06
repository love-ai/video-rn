import React, { PureComponent } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { Images } from "../../res/Images";
import { Colors } from "../../res/Colors";

/**
 * 无权限页面
 */
export default class PermissionComponent extends PureComponent {
  static propTypes = {
    mainTitle: PropTypes.string,
    image: PropTypes.number,
  };

  static defaultProps = {
    mainTitle: "您没有权限，无法访问该页面",
    image: Images.state_no_permission,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { mainTitle, image } = this.props;
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={image} resizeMode={"stretch"} />
        <Text style={styles.title_txt}>{mainTitle}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.C_F4F4F4,
  },
  image: {
    width: 42.5,
    height: 40,
  },
  title_txt: {
    fontSize: 13,
    color: Colors.C_111,
    fontWeight: "bold",
    marginTop: 20,
  },
  sub_title_txt: {
    fontSize: 13,
    color: Colors.C_999999,
    paddingHorizontal: 18,
    lineHeight: 24,
    marginTop: 45,
  },
  sub_title_bold: {
    color: Colors.C_666666,
    fontWeight: "bold",
  },
});
