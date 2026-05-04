const IS_DEV = process.env.APP_ENV === "dev";

const appName = IS_DEV ? "Splitivo Dev" : "Splitivo";
const iosBundleId = IS_DEV
  ? "com.quellixstudio.splitivo-dev"
  : "com.quellixstudio.splitivo";
const androidPackage = IS_DEV
  ? "com.quellixstudio.splitivo_dev"
  : "com.quellixstudio.splitivo";

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: appName,
    slug: "splitivo-mobile",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    scheme: IS_DEV ? "splitivo-dev" : "splitivo",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#09090B",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleId,
      infoPlist: {
        NSCameraUsageDescription:
          "Splitivo needs camera access to scan receipts",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#09090B",
      },
      edgeToEdgeEnabled: true,
      package: androidPackage,
      permissions: ["android.permission.CAMERA"],
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-apple-authentication",
      [
        "expo-camera",
        {
          cameraPermission:
            "Allow Splitivo to access your camera to scan receipts.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow Splitivo to access your photos to select receipts.",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosClientId:
            "101209994670-9t9qc1onn47n9j52g83o9qik77ur3d12.apps.googleusercontent.com",
          iosUrlScheme:
            "com.googleusercontent.apps.101209994670-9t9qc1onn47n9j52g83o9qik77ur3d12",
          googleServicesFile:
            "./src/services/auth/client_101209994670-9t9qc1onn47n9j52g83o9qik77ur3d12.apps.googleusercontent.com.plist",
        },
      ],
    ],
  },
};
