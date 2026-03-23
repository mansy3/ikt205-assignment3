import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";

const PAGE_SIZE = 5;

export default function NoteListScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1);

    if (!error && data) {
      setNotes(data);
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const start = notes.length;
    const end = start + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (!error && data) {
      setNotes((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoadingMore(false);
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate("NoteDetail", { noteId: item.id })}
      testID={`note-${item.id}`}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDate}>
        {new Date(item.created_at).toLocaleDateString("nb-NO")}
      </Text>
      <Text style={styles.notePreview} numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={loadMore}
        testID="load-more-button"
        disabled={loadingMore}
      >
        {loadingMore ? (
          <ActivityIndicator color="#8B0000" testID="load-more-spinner" />
        ) : (
          <Text style={styles.loadMoreText}>Last mer</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" testID="loader" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Mine notater</Text>
        <TouchableOpacity onPress={signOut} testID="logout-button">
          <Text style={styles.logoutText}>Logg ut</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Ingen notater ennå</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.list}
          testID="notes-list"
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddNote")}
        testID="add-note-button"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#8B0000",
  },
  heading: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
  logoutText: { color: "#FFF", fontSize: 14 },
  list: { padding: 16 },
  noteCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  noteDate: { fontSize: 12, color: "#999", marginTop: 4 },
  notePreview: { fontSize: 14, color: "#666", marginTop: 8 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { fontSize: 28, color: "#FFF", lineHeight: 30 },
  loadMoreButton: {
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8B0000",
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 20,
  },
  loadMoreText: { color: "#8B0000", fontSize: 15, fontWeight: "600" },
  emptyText: { color: "#999", fontSize: 16 },
});
