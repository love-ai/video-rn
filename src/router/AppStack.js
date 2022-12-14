import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../page/LoginPage";
import VideoListPage from "../page/VideoListPage";
import VideoPlayPage from "../page/VideoPlayPage";
import ModifyPasswordPage from "../page/ModifyPasswordPage";
import UploadPage from "../page/UploadPage";
import { NavigationContainer } from "@react-navigation/native";
import { Colors } from "../res/Colors";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"VideoListPage"}
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
          animation: "slide_from_right",
          orientation: "portrait",
          statusBarHidden: false,
          statusBarStyle: "dark",
          statusBarColor: Colors.white,
        }}//可直接使用
        headerMode={"none"} //不展示导航栏
      >
        <Stack.Screen name={"LoginPage"} component={LoginPage} options={{ title: "请登录", headerBackTitle: "" }} />
        <Stack.Screen
          name={"ModifyPasswordPage"}
          component={ModifyPasswordPage}
          options={{
            title: "修改密码",
            headerBackTitle: "",
          }} />
        <Stack.Screen
          name={"VideoListPage"}
          component={VideoListPage}
          options={{
            title: "培训视频", headerBackVisible: false,
          }}
        />
        <Stack.Screen name={"UploadPage"} component={UploadPage} options={{
          title: "视频上传",
          headerBackTitle: "",
        }} />
        <Stack.Screen
          name={"VideoPlayPage"}
          component={VideoPlayPage}
          options={{
            headerShown: false,
            statusBarHidden: true,
            animation: "fade",
            statusBarStyle: "light",
            statusBarColor: Colors.black,
            orientation: "all",
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
