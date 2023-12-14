import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { addHeaderMiddleware } from "@/lib/apiClient";

export default function Events({ eventsData }: any) {
  return (
    <Box>
      <Box
        sx={{
          width: "90vw",
          marginX: "auto",
          marginTop: "24px",
        }}
      >
        <Typography
          component={"h2"}
          sx={{
            textAlign: "center",
            letterSpacing: "4px",
            color: "gray.dark",
            fontSize: "h3.fontSize",
            borderBottom: "4px solid",
            borderColor: "gray.main",
            paddingBottom: "8px",
          }}
        >
          イベント一覧
        </Typography>
        <Stack
          sx={{
            alignItems: "center",
            marginTop: "24px",
            marginBottom: "96px",
            rowGap: "32px"
          }}
        >
          <Typography
            component={"a"}
            href="./event/1"
            sx={{
              width: "100%",
              textDecoration: "none",
            }}
          >
            <Card
              sx={{
                display: {
                  md: "flex",
                },
                width: "100%",
                border: "2px solid",
                borderColor: "gray.main",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: {
                    xs: "100%",
                    md:"25%"
                  }
                }}
                image="/event_1.png"
                alt="Live from space album cover"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  backgroundColor: "gray.light",
                }}
              >
                <CardContent
                  sx={{
                    flex: "1 auto",
                  }}
                >
                  <Typography
                    component={"div"}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "#fff",
                      width: "100%",
                      padding: "4px 16px",
                    }}
                  >
                    開発中
                  </Typography>
                  <Typography
                    component="p"
                    sx={{
                      fontSize: "h6.fontSize",
                    }}
                  >
                    2024年2月2日（Mon）0:00
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "h4.fontSize",
                    }}
                  >
                    E展
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Typography>

          <Typography
            component={"a"}
            href="./event/2"
            sx={{
              width: "100%",
              textDecoration: "none",
            }}
          >
            <Card
              sx={{
                display: {
                  md: "flex",
                },
                width: "100%",
                border: "2px solid",
                borderColor: "gray.main",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: {
                    xs: "100%",
                    md:"25%"
                  }
                }}
                image="/event_1.png"
                alt="Live from space album cover"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  backgroundColor: "gray.light",
                }}
              >
                <CardContent
                  sx={{
                    flex: "1 auto",
                  }}
                >
                  <Typography
                    component={"div"}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "#fff",
                      width: "100%",
                      padding: "4px 16px",
                    }}
                  >
                    開発中
                  </Typography>
                  <Typography
                    component="p"
                    sx={{
                      fontSize: "h6.fontSize",
                    }}
                  >
                    2024年2月2日（Mon）0:00
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "h4.fontSize",
                    }}
                  >
                    E展
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const axiosClient = addHeaderMiddleware();

  const eventsData = await axiosClient.get("/events");
  
  return {
    props: {
      eventsData: eventsData.data
    }
  }
}