"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1025,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#00C2FF",
      light: "#75D1FF",
      dark: "#006688",
    },
    secondary: {
      main: "#FFE664",
      light: "#FFF1B7",
      dark: "#DEC748",
    },
    tertiary: {
      main: "#CB97FF",
      light: "#DDB8FF",
      dark: "#5E2D8E",
    },
    gray: {
      main: "#CECECE",
      light: "#ECECEC",
      dark: "#A3A3A3",
    },
  },
});

declare module "@mui/material/styles" {
  interface PaletteOptions {
    tertiary: PaletteOptions["primary"];
    gray: PaletteOptions["primary"];
  }
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
