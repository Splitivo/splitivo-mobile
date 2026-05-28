const { withAppDelegate } = require("@expo/config-plugins");

// Injects the RocketSim Connect loader into AppDelegate.swift at prebuild time.
// Only active in DEBUG builds — the #if DEBUG guard is inside the injected code.

const ROCKETSIM_METHOD = `
  private func loadRocketSimConnect() {
    #if DEBUG
    guard (Bundle(path: "/Applications/RocketSim.app/Contents/Frameworks/RocketSimConnectLinker.nocache.framework")?.load() == true) else {
      print("Failed to load linker framework")
      return
    }
    print("RocketSim Connect successfully linked")
    #endif
  }
`;

const ROCKETSIM_CALL = `    loadRocketSimConnect()`;

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withRocketSimConnect = (config) => {
  return withAppDelegate(config, (mod) => {
    let contents = mod.modResults.contents;

    // Idempotency: skip if already injected
    if (contents.includes("loadRocketSimConnect")) {
      return mod;
    }

    // 1. Inject the method body just before `class ReactNativeDelegate`,
    //    which Expo always places after AppDelegate's closing brace.
    const classEndMarker = "\nclass ReactNativeDelegate";
    if (!contents.includes(classEndMarker)) {
      console.warn(
        "[withRocketSimConnect] Could not find class boundary — skipping injection.",
      );
      return mod;
    }

    contents = contents.replace(
      classEndMarker,
      `${ROCKETSIM_METHOD}\n${classEndMarker}`,
    );

    // 2. Call loadRocketSimConnect() at the top of didFinishLaunchingWithOptions.
    const launchFuncMarker =
      "didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil\n  ) -> Bool {";
    if (contents.includes(launchFuncMarker)) {
      contents = contents.replace(
        launchFuncMarker,
        `${launchFuncMarker}\n${ROCKETSIM_CALL}`,
      );
    } else {
      console.warn(
        "[withRocketSimConnect] Could not find didFinishLaunchingWithOptions — call site not injected.",
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });
};

module.exports = withRocketSimConnect;
