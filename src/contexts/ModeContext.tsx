"use client";

import { createContext, useContext, useState } from "react";

type Mode = "movies" | "tv";

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
  isMovieMode: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("movies");

  const toggleMode = () => {
    setMode((prev) => (prev === "movies" ? "tv" : "movies"));
  };

  return (
    <ModeContext.Provider
      value={{ mode, toggleMode, isMovieMode: mode === "movies" }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
