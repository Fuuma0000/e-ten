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
import { addHeaderMiddleware, addSitePasswordHeader } from "@/lib/apiClient";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type VERIFY = {
  message: any;
};

export default function SignIn() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const status = searchParams.get("status");
  var color = "black";
  var link = {
    link: "./in",
    message: "ログイン画面へ"
  };
  console.log(message);
  console.log(status);

  if (Number(status) != 200) {
    color = "red";
    link = {
      link: "./up",
      message: "新規登録画面へ"
    }
  }

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        background: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        component={"p"}
        sx={{
          fontSize: "h4.fontSize",
          color: color,
        }}
      >
        {message}
      </Typography>
      <Typography
       component={"a"}
       href={link.link}
      >
        {link.message}
      </Typography>
    </Stack>
  );
}
