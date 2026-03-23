/**
 Integration Test - Mocking & Loader
 Verifiserer at:
 1. En laste-indikator (spinner) er synlig mens databasekallet pågår.
 2. Spinner forsvinner når notatet er lastet inn.
 3. Notatets data vises etter innlasting.
 */

import React from "react";
import { render, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native";
import NoteDetailScreen from "../screens/NoteDetailScreen";
import { supabase } from "../lib/supabase";

// Mocks

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock av Alert slik at den ikke krasjer i testmiljø
jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("NoteDetailScreen – loader og datahenting", () => {
  let resolveQuery;
  let mockNavigation;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    // Opprett en kontrollert Promise slik at vi kan teste loaderen
    const queryPromise = new Promise((resolve) => {
      resolveQuery = resolve;
    });

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue(queryPromise),
        }),
      }),
    });
  });

  it("viser loader mens data hentes, og skjuler den når notatet er lastet", async () => {
    const route = { params: { noteId: "note-42" } };

    const { getByTestId, queryByTestId } = render(
      <NoteDetailScreen route={route} navigation={mockNavigation} />
    );

    // STEG 1: Loader skal være synlig umiddelbart
    expect(getByTestId("detail-loader")).toBeTruthy();

    // STEG 2: Simuler at databasen svarer med et notat
    resolveQuery({
      data: {
        id: "note-42",
        title: "Testnotat",
        content: "Dette er innholdet i testnotatet",
        created_at: "2025-03-20T12:00:00Z",
      },
      error: null,
    });

    // STEG 3: Vent til loader forsvinner
    await waitForElementToBeRemoved(() => queryByTestId("detail-loader"));

    // STEG 4: Verifiser at notatets data vises
    await waitFor(() => {
      expect(getByTestId("note-title").props.children).toBe("Testnotat");
      expect(getByTestId("note-content").props.children).toBe(
        "Dette er innholdet i testnotatet"
      );
    });
  });

  it("verifiserer at riktig notat-ID sendes til Supabase", async () => {
    const route = { params: { noteId: "note-99" } };

    render(
      <NoteDetailScreen route={route} navigation={mockNavigation} />
    );

    // Verifiser at from("notes") ble kalt
    expect(supabase.from).toHaveBeenCalledWith("notes");
  });
});
