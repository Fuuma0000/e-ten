"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
}

export default function SignIn() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  console.log(email);
  console.log(token);
  const router = useRouter();
  const [eventData, setEventData] = useState();
  const [message, setMessage] = useState<VERIFY>({message: "エラー"});

  useEffect(() => {
    const asyncWrapper = async () => {
      const axiosClient = addHeaderMiddleware();
      
      // TODO:レスポンスによって飛ばし先を変える
      // TODO:現在の日時と終了日時・開始日時を比較して画面に描画する文字列を返す関数を記述する
      // TODO:エラーの文言をステートに詰める必要あるか？.どうせログインページに飛ばすのに？.聞く

      try {
        const params = {
          email: email,
          token: token
        };
        const eventsResponse = await axiosClient.get("/verify", { params, withCredentials: true })
        .then((res: AxiosResponse<VERIFY>) => {
          const { data, status } = res;
          console.log(status);
          router.push(`./resolt?message=${data.message}&status=${status}`);
          return data;
        });
        console.log(eventsResponse);
        setMessage(eventsResponse);

      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          console.log(e.response.data);
          setMessage(e.response.data);
          router.push(`./resolt?message=${e.response.data.message}&status=${e.response.status}`);
        }
      }
    }

   asyncWrapper();
  }, []);
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
       <CircularProgress size={"5rem"}/>

    </Stack>
  );
}
