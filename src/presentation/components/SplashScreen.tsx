import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withTiming(1, { duration: 600 });

    // App name fades in after logo
    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

    // Tagline fades in last
    taglineOpacity.value = withDelay(550, withTiming(1, { duration: 400 }));

    // Fade out the whole splash
    containerOpacity.value = withDelay(
      1400,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, containerStyle]}
    >
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        {/* Split icon: two overlapping rectangles */}
        <View style={styles.iconWrapper}>
          <View style={[styles.card, styles.cardBack]} />
          <View style={[styles.card, styles.cardFront]}>
            <View style={styles.divider} />
          </View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.appName, textStyle]}>
        Splitivo
      </Animated.Text>

      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Split smarter, transfer less.
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#09090B",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: 52,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  cardBack: {
    backgroundColor: "#27272A",
    borderColor: "#3F3F46",
    transform: [{ rotate: "-6deg" }, { translateX: -4 }, { translateY: 4 }],
  },
  cardFront: {
    backgroundColor: "#18181B",
    borderColor: "#52525B",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 28,
    height: 1.5,
    backgroundColor: "#A1A1AA",
    borderRadius: 1,
  },
  appName: {
    fontSize: 42,
    fontFamily: "Geist_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Geist_400Regular",
    color: "#71717A",
    marginTop: 8,
  },
});
