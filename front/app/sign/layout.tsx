import { Typography } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      {children}
    </Typography>
  );
}
