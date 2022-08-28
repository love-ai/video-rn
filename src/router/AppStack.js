import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../page/LoginPage";
import VideoListPage from "../page/VideoListPage";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"LoginPage"}
      headerMode={"none"} //不展示导航栏
      screenOptions={({ route }) => ({
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // 切换路由时水平动画
      })}
    >
      <Stack.Screen name={"LoginPage"} component={LoginPage} />
      <Stack.Screen
        name={"VideoListPage"}
        component={VideoListPage}
      />
    </Stack.Navigator>
  );
};
