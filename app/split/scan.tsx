import React, { useRef, useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { Button } from "../../src/presentation/components/Button";
import { ArrowLeft } from "lucide-react-native";
import { toast } from "sonner-native";

export default function ScanScreen() {
  const { colors } = useTheme();
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState<"camera" | "gallery">("camera");
  const [capturing, setCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (mode === "gallery") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.9,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        router.push({
          pathname: "/split/confirm",
          params: { imageUri: result.assets[0].uri },
        });
      }
      return;
    }

    if (!cameraRef.current) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) {
        router.push({
          pathname: "/split/confirm",
          params: { imageUri: photo.uri },
        });
      }
    } catch {
      toast.error("Could not capture photo. Try using Gallery instead.");
    } finally {
      setCapturing(false);
    }
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Scan Receipt
        </Text>
        <Pressable
          style={[
            styles.currencyPill,
            { backgroundColor: colors.bg.container },
          ]}
        >
          <Text style={[styles.currencyText, { color: colors.text.primary }]}>
            {currency}
          </Text>
        </Pressable>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.viewfinder}>
        {mode === "camera" ? (
          permission == null ? (
            <ActivityIndicator color={colors.accent.primary} />
          ) : !permission.granted ? (
            <View style={styles.permissionBox}>
              <Text
                style={[
                  styles.permissionText,
                  { color: colors.text.secondary },
                ]}
              >
                Camera access is required to scan receipts.
              </Text>
              <Button
                title="Grant Permission"
                onPress={requestPermission}
                size="md"
              />
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing="back"
                mode="picture"
              />
              {/* Receipt guide frame — sibling of CameraView, not a child */}
              <View style={styles.overlay} pointerEvents="none">
                <View
                  style={[
                    styles.scanFrame,
                    { borderColor: colors.accent.primary },
                  ]}
                />
              </View>
            </View>
          )
        ) : (
          <View
            style={[
              styles.galleryPlaceholder,
              { backgroundColor: colors.bg.container },
            ]}
          >
            <Text style={{ color: colors.text.secondary, fontSize: 15 }}>
              Tap "Choose from Gallery" below
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setMode("camera")}
            style={[
              styles.modeButton,
              mode === "camera" && { backgroundColor: colors.accent.primary },
            ]}
          >
            <Text
              style={{
                color:
                  mode === "camera"
                    ? colors.text.onAccent
                    : colors.text.secondary,
                fontWeight: "600",
              }}
            >
              Camera
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("gallery")}
            style={[
              styles.modeButton,
              mode === "gallery" && { backgroundColor: colors.accent.primary },
            ]}
          >
            <Text
              style={{
                color:
                  mode === "gallery"
                    ? colors.text.onAccent
                    : colors.text.secondary,
                fontWeight: "600",
              }}
            >
              Gallery
            </Text>
          </Pressable>
        </View>

        <Button
          title={
            capturing
              ? "Capturing…"
              : mode === "gallery"
                ? "Choose from Gallery"
                : "Capture"
          }
          onPress={handleCapture}
          fullWidth
          size="lg"
          disabled={
            capturing ||
            (mode === "camera" && (!permission || !permission.granted))
          }
        />

        <Pressable onPress={() => router.push("/split/manual-entry")}>
          <Text style={[styles.manualLink, { color: colors.accent.primary }]}>
            Enter Manually
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  currencyPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  currencyText: { fontSize: 14, fontWeight: "600" },
  viewfinder: { flex: 1 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: "75%",
    aspectRatio: 0.65,
    borderWidth: 2,
    borderRadius: 16,
    borderStyle: "dashed",
  },
  permissionBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: { fontSize: 14, textAlign: "center" },
  galleryPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  modeToggle: { flexDirection: "row", gap: 8, justifyContent: "center" },
  modeButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  manualLink: { textAlign: "center", fontSize: 14, fontWeight: "600" },
});
