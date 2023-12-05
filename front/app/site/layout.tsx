import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          flexGrow: 1,
          minHeight: "8vh",
        }}
      >
        <Typography
          component={"h1"}
          sx={{
            marginY: "auto",
            textAlign: "center",
            width: "25%",
            fontSize: "1.2rem",
          }}
        >
          サイト名
        </Typography>
        <Typography
          component={"div"}
          sx={{
            backgroundColor: "primary.light",
            width: "75%",
            height: "8vh",
            borderRadius: "32px 0px 0px 180px / 0px 0px 0px 150px",
            borderBottom: "8px solid",
            borderLeft: "8px solid",
            borderColor: "tertiary.main",
            "::before": {
              content: "''",
              position: "absolute",
              top: 0,
              right: 0,
              width: "75%",
              height: "8vh",
              borderRadius: "32px 0px 0px 180px / 0px 0px 0px 150px",
              borderBottom: "8px solid",
              borderLeft: "8px solid",
              borderColor: "secondary.main",
            },
          }}
        >
          

        </Typography>
      </Stack>
      {children}
    </>
  );
}
