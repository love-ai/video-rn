import { NavigationContainer } from "@react-navigation/native";
import React, { PureComponent } from "react";
import { View } from "react-native";
import { AppStack } from "./AppStack";


export default class AppRouter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //状态机变量声明
    };
  }

  componentDidMount() {}

  render() {
    return (
        <View style={{ flex: 1 }}>
          <NavigationContainer screenProps={{ ...this.props }}>
            <AppStack />
          </NavigationContainer>
        </View>
    );
  }

  componentWillUnmount() {}
}
