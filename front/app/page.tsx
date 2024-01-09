"use client"
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Index() {
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
          component="h1"
          sx={{
            color: "primary.main",
            fontSize: {
              xs: "h2.fontSize",
              md: "h1.fontSize",
              lg: "h1.fontSize",
            },
            fontWeight: "bold",
            marginBottom: "80px",
            alignItems: "center",
          }}
        >
          サイト名
        </Typography>

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

function test () {
  console.log("aa")
}