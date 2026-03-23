import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function NoteDetailScreen({ route, navigation }) {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) {
        Alert.alert("Feil", "Kunne ikke hente notatet");
        navigation.goBack();
        return;
      }

      setNote(data);
      setLoading(false);
    };

    fetchNote();
  }, [noteId]);

  const handleDelete = async () => {
    Alert.alert("Slett notat", "Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: async () => {
          await supabase.from("notes").delete().eq("id", noteId);
          navigation.navigate("NoteList");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered} testID="detail-loading">
        <ActivityIndicator size="large" color="#8B0000" testID="detail-loader" />
        <Text style={styles.loadingText}>Laster notat...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title} testID="note-title">
        {note.title}
      </Text>
      <Text style={styles.date}>
        {new Date(note.created_at).toLocaleDateString("nb-NO")}
      </Text>
      <Text style={styles.content} testID="note-content">
        {note.content}
      </Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        testID="delete-button"
      >
        <Text style={styles.deleteText}>Slett notat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#FFF" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#333" },
  date: { fontSize: 13, color: "#999", marginTop: 6, marginBottom: 16 },
  content: { fontSize: 16, color: "#444", lineHeight: 24 },
  loadingText: { color: "#999", marginTop: 12, fontSize: 14 },
  deleteButton: {
    marginTop: 40,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CC0000",
    alignItems: "center",
    marginBottom: 40,
  },
  deleteText: { color: "#CC0000", fontSize: 15, fontWeight: "600" },
});
