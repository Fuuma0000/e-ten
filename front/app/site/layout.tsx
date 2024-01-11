import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
      }}
    >
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
            fontSize: { xs: "h5.fontSize", md: "h3.fontSize" },
          }}
        >
          E++
        </Typography>
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "end",
            backgroundColor: "primary.light",
            width: "75%",
            height: "8vh",
            paddingRight: "8px",
            marginBottom: "10px",
            borderRadius: "32px 0px 0px 180px / 0px 0px 0px 150px",
            borderBottom: "10px solid",
            borderLeft: "10px solid",
            borderColor: "tertiary.main",
            "::before": {
              content: "''",
              position: "absolute",
              top: 0,
              right: 0,
              width: "75%",
              height: "8vh",
              borderRadius: "32px 0px 0px 180px / 0px 0px 0px 150px",
              borderBottom: "10px solid",
              borderLeft: "10px solid",
              borderColor: "secondary.main",
            },
          }}
        >
          <BookmarkIcon
            sx={{
              height: "64px",
              width: "64px",
              color: "#fff",
              marginX: "8px",
            }}
          />
          <AccountCircleIcon
            sx={{
              height: "64px",
              width: "64px",
              color: "#fff",
              marginX: "8px",
            }}
          />
        </Stack>
      </Stack>
      <Box
        sx={{
          minHeight: "84vh",
        }}
      >
        {children}
      </Box>

      <Stack
        sx={{
          height: "500px",
        }}
      >
        <Typography
         component={"div"}
         sx={{
          height: "50px",
          width: "33%",
          backgroundColor: "secondary.main",
          borderRadius: " 0px 75px 75px 0px",
         }}
        />
        <Typography
         component={"div"}
         sx={{
          height: "50px",
          width: "66%",
          backgroundColor: "tertiary.main",
          borderRadius: " 0px 75px 75px 0px",
         }}
        />
        <Typography
         component={"div"}
         sx={{
          height: "400px",
          backgroundColor: "primary.light",
          borderRadius: " 0px 75px 0px 0px",
         }}
        >

        </Typography>
      </Stack>
    </Box>
  );
}
