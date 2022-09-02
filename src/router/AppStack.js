import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../page/LoginPage";
import VideoListPage from "../page/VideoListPage";
import VideoPlayPage from "../page/VideoPlayPage";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"LoginPage"}
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
          animation: "slide_from_right",
        }}//可直接使用
        headerMode={"none"} //不展示导航栏
      >
        <Stack.Screen name={"LoginPage"} component={LoginPage} options={{ title: "请登录" }} />
        <Stack.Screen
          name={"VideoListPage"}
          component={VideoListPage}
          options={{ title: "培训视频", headerBackVisible: false }}
        />
        <Stack.Screen
          name={"VideoPlayPage"}
          component={VideoPlayPage}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
