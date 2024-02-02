"use client"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { addHeaderMiddleware, handleExpiredToken } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Events() {
  const [eventData, setEventData] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const asyncWrapper = async () => {
      const axiosClient = addHeaderMiddleware();
      const router = useRouter();
      
      // TODO:レスポンスによって飛ばし先を変える
      // TODO:現在の日時と終了日時・開始日時を比較して画面に描画する文字列を返す関数を記述する
      // TODO:エラーの文言をステートに詰める必要あるか？.どうせログインページに飛ばすのに？.聞く

      try {
        const eventsResponse = await axiosClient.get("/events", { withCredentials: true });
        const eventsData = eventsResponse.data;
        console.log(eventsData);
        setEventData(eventData);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          // アクセストークンの有効期限が切れていた時
          if (e.response.status === 401 && e.response.data.message === "トークンの有効期限が切れています") {
            const response = await handleExpiredToken("/events", "GET");

            console.log("-----再取得したレスポンス-----");
            console.log(response);
            if (response.status === "OK") {
              setEventData(response.responseData);
            } else {
              // ここが発火することはないはず
              setErrorMessage(response.responseData);
            }
          } else {
            // トークンの有効切れに関係ないエラー処理
            console.log(e.response.data);
            setErrorMessage(e.response.data);

            router.push("/");
          }
        }
      }
    }

   asyncWrapper();
  }, []);
  
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

// getServerSIdeProps使えないらしいので代替
// export const getEventData = async () => {
//   const axiosClient = addHeaderMiddleware();
//   const eventsData = await axiosClient.get("/events");

//   return eventsData.data;
// }
