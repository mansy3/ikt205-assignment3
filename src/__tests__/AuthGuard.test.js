/**
 Auth Guard Test - Tilgangskontroll
 Verifiserer at:
 1. Beskyttet innhold (notatliste, legg til notat) er IKKE tilgjengelig
 når brukeren ikke er logget inn.
 2. Login-skjermen vises i stedet.
 3. Beskyttet innhold ER tilgjengelig når brukeren er logget inn.
 */

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "../components/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import NoteListScreen from "../screens/NoteListScreen";

// Mocks

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
    }),
  },
}));

// Mock av useFocusEffect slik at den bare kjører callback umiddelbart
jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useFocusEffect: (cb) => {
      const React = require("react");
      React.useEffect(() => {
        const cleanup = cb();
        return typeof cleanup === "function" ? cleanup : undefined;
      }, []);
    },
  };
});

const Stack = createNativeStackNavigator();

function TestApp({ user }) {
  return (
    <AuthProvider initialUser={user}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="NoteList" component={NoteListScreen} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

describe("Auth Guard – tilgangskontroll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("viser LoginScreen når brukeren IKKE er logget inn (user = null)", async () => {
    const { getByTestId, queryByTestId } = render(<TestApp user={null} />);

    await waitFor(() => {
      // Login-skjermen skal være synlig
      expect(getByTestId("login-button")).toBeTruthy();
      expect(getByTestId("email-input")).toBeTruthy();

      // Notatliste og legg-til-knapp skal IKKE være synlig
      expect(queryByTestId("notes-list")).toBeNull();
      expect(queryByTestId("add-note-button")).toBeNull();
    });
  });

  it("viser NoteListScreen når brukeren ER logget inn", async () => {
    const mockUser = { id: "user-123", email: "test@test.no" };
    const { getByTestId, queryByTestId } = render(
      <TestApp user={mockUser} />
    );

    await waitFor(() => {
      // Login-skjermen skal IKKE være synlig
      expect(queryByTestId("login-button")).toBeNull();

      // Legg-til-knapp skal være tilgjengelig
      expect(getByTestId("add-note-button")).toBeTruthy();
    });
  });

  it("viser IKKE beskyttet innhold (add-note-button) for uautentisert bruker", () => {
    const { queryByTestId } = render(<TestApp user={null} />);

    // Direkte sjekk uten waitFor – innholdet skal aldri vises
    expect(queryByTestId("add-note-button")).toBeNull();
    expect(queryByTestId("logout-button")).toBeNull();
  });
});
