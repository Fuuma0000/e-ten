"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addSitePasswordHeader } from "@/lib/apiClient";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // TODO:後で消す
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    // ログイン処理
    const axiosClient = addSitePasswordHeader();

    try {
      await axiosClient.post("/signin", {
        email: data.get("email"),
        password: data.get("password")
      }, { withCredentials: true });

      // トークン保持
      // document.cookie = `x-login-token=${loginResponse.data.accessToken}`;
      // document.cookie = `x-refresh-token=${loginResponse.data.refreshToken}`;

      // TODO:リフレッシュトークン切れてたときみたいなやつまだやってないから後でやる

      router.push("/site/events");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        // TODO:後で消す
        console.log(e.response.data);
        setErrorMessage(e.response.data);
      }
    }
  };

  return (
    <Stack
      sx={{
        widows: "100%",
        height: "100%",
        background: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        component="h1"
        sx={{
          color: "primary.main",
          fontSize: { xs: "h2.fontSize", md: "h1.fontSize", lg: "h1.fontSize" },
          fontWeight: "bold",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        Sign In
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mx: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            fontSize: { xs: "1rem", md: "1.2rem" },
            backgroundColor: "#FFF",
            color: "#898989",
            border: "2px solid #CBCBCB",
            boxShadow: 0,
            ":hover": {
              backgroundColor: "primary.main",
              color: "#FFF",
              borderColor: "primary.light",
              boxShadow: 0
            },
            ":active": {
              backgroundColor: "primary.main",
              color: "#FFF",
              borderColor: "primary.light",
              boxShadow: 0
            },
          }}
        >
          Sign In
        </Button>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href="./up" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Stack>
      </Box>
    </Stack>
  );
}
