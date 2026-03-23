import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";

export default function AddNoteScreen({ navigation, route }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const imageUri = route?.params?.imageUri || null;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Feil", "Tittel er påkrevd");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("notes").insert({
      title: title.trim(),
      content: content.trim(),
      user_id: user.id,
    });
    setSaving(false);

    if (error) {
      Alert.alert("Feil", "Kunne ikke lagre notatet");
      return;
    }

    navigation.navigate("NoteList");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Nytt notat</Text>

      <TextInput
        style={styles.input}
        placeholder="Tittel"
        value={title}
        onChangeText={setTitle}
        testID="title-input"
      />

      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Skriv notatet ditt her..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        testID="content-input"
      />

      {imageUri && (
        <Text style={styles.imageText}>Bilde lagt ved</Text>
      )}

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate("Camera")}
        testID="camera-button"
      >
        <Text style={styles.cameraButtonText}>Ta bilde</Text>
      </TouchableOpacity>

      {saving ? (
        <ActivityIndicator size="large" color="#8B0000" testID="save-spinner" />
      ) : (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          testID="save-button"
        >
          <Text style={styles.saveButtonText}>Lagre</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#FFF" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  contentInput: {
    height: 200,
  },
  cameraButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B0000",
    alignItems: "center",
    marginBottom: 12,
  },
  cameraButtonText: {
    color: "#8B0000",
    fontSize: 15,
    fontWeight: "600",
  },
  imageText: {
    color: "#4CAF50",
    fontSize: 14,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#8B0000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});