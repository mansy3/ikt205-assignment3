import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

export default function CameraScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permText}>Kameratilgang er nødvendig</Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Gi tilgang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      navigation.navigate("AddNote", { imageUri: photo.uri });
    }
  };

  return (
    <View style={styles.container}>
      {isFocused ? (
        <CameraView style={styles.camera} ref={cameraRef} testID="camera-view">
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              testID="capture-button"
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.centered} testID="camera-paused">
          <Text style={styles.permText}>Kamera pauset</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF",
  },
  permText: { color: "#FFF", fontSize: 16, marginBottom: 16 },
  permButton: {
    backgroundColor: "#8B0000",
    padding: 14,
    borderRadius: 8,
  },
  permButtonText: { color: "#FFF", fontSize: 15 },
});