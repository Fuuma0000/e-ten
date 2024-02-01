"use client"
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { sendSitePassword } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function Index() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  console.log(router);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  // エラーメッセージはerrorMessageに詰まっているのでそれを使ってください
  const test = async () => {
    const sitePasswordToSend = inputValue;
    const response = await sendSitePassword(sitePasswordToSend);
    if (response?.errorFlag === false) {
      console.log("正当なリクエストが通った時に発火します。");
  
      router.push("/sign/up");
    } else {
      console.log("正当なリクエストが通らなかった時に発火します。");
      // console.log(response);
      setErrorMessage(response?.message);
      setInputValue("");
    }
  }

  return (
    <Typography
      component="div"
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <Typography
        component="img"
        src="/background_item_left_top.png"
        alt="background item"
        sx={{
          width: { xs: "40%", md: "35%", lg: "30%", xl: "25%" },
          height: "auto",
          zIndex: "-10",
          position: "absolute",
          left: "0",
          top: "0",
        }}
      />

      <Typography
        component="img"
        src="/background_item_right_bottom.png"
        alt="background item"
        sx={{
          width: { xs: "40%", md: "35%", lg: "30%", xl: "25%" },
          height: "auto",
          zIndex: "-10",
          position: "absolute",
          right: "0",
          bottom: "0",
        }}
      />

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
          component="img"
          src="/e_pluse_pluse_logo.png"
          sx={{
            width: {xs: "200px", md: "400px" },
            marginBottom: {xs: "32px",md:"104px"}
          }}
        />

        <Typography
          component="div"
          sx={{
            width: { xs: "50%", md: "40%", lg: "30%", xl: "25%" },
          }}
        >
          <TextField
            id="outlined-password-input"
            label="SitePassword"
            type="password"
            autoComplete="current-password"
            sx={{
              width: "100%",
              marginBottom: "8px",
            }}
            value={inputValue}
            onChange={handleInputChange}      
          />
          <Button
            variant="contained"
            disableElevation
            onClick={test}
            sx={{
              backgroundColor: "#FFF",
              color: "#898989",
              border: "4px solid #CBCBCB",
              width: "100%",
              paddingY: "8px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "tertiary.main",
                color: "#FFF",
                border: "4px solid",
                borderColor: "tertiary.light",
              },
              ":active": {
                backgroundColor: "tertiary.main",
                color: "#FFF",
                border: "4px solid",
                borderColor: "tertiary.light",
              },
            }}
          >
            Sign
          </Button>
        </Typography>
      </Stack>
    </Typography>
  );
}