"use client";
import { addSitePasswordHeader } from "@/lib/apiClient";
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
import axios from "axios";
import { useState } from "react";

export default function SignUp() {
  // errorMessageに返ってきたエラーメッセージを詰めてます.使ってください
  const [errorMessage, setErrorMessage] = useState("");
  // 登録が成功した時に返ってくるメッセージが詰まっています.使ってください
  const [registSuccessMessage, setRegistSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // TODO:後で消す
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    // 登録処理
    const axiosClient = addSitePasswordHeader();

    try {
      const response = await axiosClient.post("/signup", {
        email: data.get("email"),
        password: data.get("password")
      });

    // TODO:ステータスコードにより飛び先変更する
      console.log(response.data);
      setRegistSuccessMessage(response.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        setErrorMessage(e.response.data);
        console.log(e.response.data);
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
        Sign Up
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
          Sign Up
        </Button>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href="./in" variant="body2">
            Go to Sign In
          </Link>
        </Stack>
      </Box>
    </Stack>
  );
}
