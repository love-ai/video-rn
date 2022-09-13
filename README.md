# video-rn

### Android上运行
```
yarn android
```
或者通过Android Studio 连接手机后运行

### Android打release包
react-native-compressor解决打包问题，修改/node_modules/react-native-compressor/android/build.gradle 文件
```
 android {
-    compileSdkVersion safeExtGet('Compressor_compileSdkVersion', 29)
-    buildToolsVersion safeExtGet('Compressor_buildToolsVersion', '29.0.2')
+    compileSdkVersion safeExtGet('compileSdkVersion', 29)
+    buildToolsVersion safeExtGet('buildToolsVersion', '29.0.2')
     defaultConfig {
-        minSdkVersion safeExtGet('Compressor_minSdkVersion', 16)
-        targetSdkVersion safeExtGet('Compressor_targetSdkVersion', 29)
+        minSdkVersion safeExtGet('minSdkVersion', 16)
+        targetSdkVersion safeExtGet('targetSdkVersion', 29)
         versionCode 1
         versionName "1.0"
```
后 `cd android/` 执行：`./gradlew assembleRelease`

### iOS上运行
安装pod依赖
```
cd ios/
pod install
```
运行

通过Xcode打开项目，连接手机后运行，首次运行需在设置-通用-VPN与设备管理中添加信任.
