/**
Unit Test - Opprettelse & Navigasjon
Verifiserer at:
1. Når et gyldig notat sendes inn, kjører opprettelseslogikken.
2. Brukeren blir automatisk navigert tilbake til NoteList-skjermen.
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddNoteScreen from "../screens/AddNoteScreen";
import { supabase } from "../lib/supabase";

// Mock Supabase
jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock AuthContext – gi en innlogget bruker
jest.mock("../components/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-123" },
  }),
}));

describe("AddNoteScreen – opprettelse og navigasjon", () => {
  let mockNavigate;
  let mockInsert;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNavigate = jest.fn();

    mockInsert = jest.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({
      insert: mockInsert,
    });
  });

  it("oppretter notatet og navigerer til NoteList ved gyldig inndata", async () => {
    const { getByTestId } = render(
      <AddNoteScreen navigation={{ navigate: mockNavigate }} />
    );

    // Fyll inn tittel og innhold
    fireEvent.changeText(getByTestId("title-input"), "Min testtittel");
    fireEvent.changeText(getByTestId("content-input"), "Litt innhold her");

    // Trykk lagre-knappen
    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      // Verifiser at Supabase insert ble kalt med riktige data
      expect(supabase.from).toHaveBeenCalledWith("notes");
      expect(mockInsert).toHaveBeenCalledWith({
        title: "Min testtittel",
        content: "Litt innhold her",
        user_id: "user-123",
      });

      // Verifiser at navigasjon skjedde til NoteList
      expect(mockNavigate).toHaveBeenCalledWith("NoteList");
    });
  });

  it("navigerer IKKE dersom tittel er tom", async () => {
    const { getByTestId } = render(
      <AddNoteScreen navigation={{ navigate: mockNavigate }} />
    );

    // La tittel stå tom – trykk lagre
    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      // Insert skal IKKE ha blitt kalt
      expect(mockInsert).not.toHaveBeenCalled();
      // Navigasjon skal IKKE ha skjedd
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
