import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookmarkIcon from "@mui/icons-material/Bookmark";

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
        <Stack
          sx={{
            width: "25%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography component={"a"} href="/site/events">
            <Typography
              component={"img"}
              src="/e_pluse_pluse_logo.png"
              sx={{
                marginY: "auto",
                textAlign: "center",
                width: {xs: "48px", md:"152px"},
                marginLeft: "",
                fontSize: { xs: "h5.fontSize", md: "h3.fontSize" },
              }}
            />
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
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
            "::after": {
              content: "''",
              position: "absolute",
              top: 0,
              right: 0,
              width: "calc(100% + 10px)",
              height: "8vh",
              borderRadius: "32px 0px 0px 180px / 0px 0px 0px 150px",
              borderBottom: "10px solid",
              borderLeft: "10px solid",
              borderColor: "secondary.main",
              zIndex: "-1",
            },
          }}
        >
          <Typography
            component={"a"}
            href="/site/bookmark"
            sx={{
              display: "inline-block",
              height: "64px",
              width: "64px",
              marginX: "8px",
            }}
          >
            <BookmarkIcon
              sx={{
                height: "100%",
                width: "100%",
                color: "#fff",
              }}
            />
          </Typography>
          <Typography
            component={"a"}
            href="/site/my-profile/view"
            sx={{
              display: "inline-block",
              height: "64px",
              width: "64px",
              marginX: "8px",
            }}
          >
            <AccountCircleIcon
              sx={{
                height: "100%",
                width: "100%",
                color: "#fff",
              }}
            />
          </Typography>
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
        ></Typography>
      </Stack>
    </Box>
  );
}
