import { Button, Stack, Typography } from "@mui/material";

export default function Index() {
    return (
      <Stack
        sx={{
          widows: "100%",
          height: "100%",
          background: "transparent",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          component="h1"
          sx={{
            color: "primary.main",
            fontSize: {xs:"h2.fontSize", md: "h1.fontSize", lg: "h1.fontSize"},
            fontWeight: "bold",
            marginBottom: "80px",
            alignItems: "center"
          }}
        >
          Sign in
        </Typography>
      </Stack>
    )
}