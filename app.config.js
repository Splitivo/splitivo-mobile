const APP_ENV = process.env.APP_ENV ?? "prod";
const IS_DEV = APP_ENV === "dev";
const IS_SMOKE = APP_ENV === "smoke";

const apiUrl =
  process.env.API_URL ||
  (IS_DEV || IS_SMOKE
    ? "https://splitivo-dev-server-101209994670.asia-southeast2.run.app"
    : "https://api.splitivo.com");
const debugEnabled = process.env.DEBUG_ENABLED === "true";

const appName = IS_DEV
  ? "Splitivo Dev"
  : IS_SMOKE
    ? "Splitivo Smoke"
    : "Splitivo";
const iosBundleId = IS_DEV
  ? "com.quellixstudio.splitivo-dev"
  : IS_SMOKE
    ? "com.quellixstudio.splitivo-smoke"
    : "com.quellixstudio.splitivo";
const androidPackage = IS_DEV
  ? "com.quellixstudio.splitivo_dev"
  : IS_SMOKE
    ? "com.quellixstudio.splitivo_smoke"
    : "com.quellixstudio.splitivo";
const icon = IS_DEV
  ? "./assets/icons/icon-dev.png"
  : IS_SMOKE
    ? "./assets/icons/icon-smoke.png"
    : "./assets/icons/icon-prod.png";

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: appName,
    slug: "splitivo-mobile",
    version: "0.0.1",
    orientation: "portrait",
    icon: icon,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    scheme: IS_DEV ? "splitivo-dev" : "splitivo",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0d0d0f",
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
        foregroundImage: icon,
        backgroundColor: "#0d0d0f",
      },
      edgeToEdgeEnabled: true,
      package: androidPackage,
      permissions: ["android.permission.CAMERA"],
    },
    web: {
      favicon: icon,
      bundler: "metro",
    },
    extra: {
      eas: {
        projectId: "ebd189ab-ef66-4efc-a959-eed3305526bc",
      },
      apiUrl,
      debugEnabled,
      appEnv: APP_ENV,
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
