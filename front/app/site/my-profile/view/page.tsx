"use client";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  dividerClasses,
  styled,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import { useEffect, useState } from "react";
import { addHeaderMiddleware } from "@/lib/apiClient";
import axios from "axios";

export default function MyProfileView() {
  const [myProfileData, setMyProfiledata] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const asyncWrapper = async () => {
      const axiosClient = addHeaderMiddleware();

      try {
        const response = await axiosClient.get("/myprofile");
        console.log("--------------------------------------");
        console.log(response);
        console.log("--------------------------------------");
  
        setMyProfiledata(response.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          console.log(e.response.data);
          setErrorMessage(e.response.data);
        }
      }  
    }
  
    asyncWrapper();
  }, []);

  return (
    <Box>
      <Typography component={"a"} href="./set">
        <BuildCircleIcon
          sx={{
            width: { xs: "58px", sm: "80px", md: "100px" },
            height: { xs: "58px", sm: "80px", md: "100px" },
            color: "gray.dark",
            position: "fixed",
            bottom: { xs: "16px", md: "24px" },
            right: { xs: "8px", md: "24px" },
          }}
        />
      </Typography>
      <Stack
        sx={{
          width: "90vw",
          marginX: "auto",
          marginTop: "24px",
          marginBottom: "160px",
          gap: { xs: "8px", md: "16px" },
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            padding: { xs: "16px 16px", md: "24px 40px" },
            backgroundColor: "gray.light",
            color: "gray.dark",
            borderRadius: "80px",
            border: "8px solid",
            borderColor: "gray.main",
            gap: { xs: "8px", md: "16px" },
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: { lg: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: "24px", md: "32px" },
            }}
          >
            <Typography
              component={"img"}
              src="/test_user_icon.jpg"
              sx={{
                width: { xs: "300px", md: "400px" },
                height: { xs: "300px", md: "400px" },
                borderRadius: "50%",
                border: "8px solid",
              }}
            />
            <Stack
              sx={{
                width: "100%",
              }}
            >
              <Typography
                component={"h2"}
                sx={{
                  fontSize: { xs: "h4.fontSize", md: "h3.fontSize" },
                  borderBottom: "4px solid",
                }}
              >
                久乗建汰
              </Typography>
              <Stack
                sx={{
                  padding: "8px 16px",
                }}
              >
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  コース：IT開発エキスパートコース
                </Typography>
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  入学・卒業年次：{"2022"}〜{"2026"}
                </Typography>
                <Stack
                  sx={{
                    marginY: "8px",
                  }}
                >
                  <Typography
                    component={"p"}
                    sx={{
                      fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                    }}
                  >
                    希望職種
                  </Typography>
                  <Typography
                    component={"ul"}
                    sx={{
                      paddingX: "3rem",
                    }}
                  >
                    <Typography
                      component={"li"}
                      sx={{
                        fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                      }}
                    >
                      WEBフロント
                    </Typography>
                  </Typography>
                </Stack>
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  就活状況：{true ? "就活中" : "内定済み"}
                </Typography>
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  メールアドレス：2220025@ecc.ac.jp
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <Typography
              component={"h3"}
              sx={{
                fontSize: { xs: "h5.fontSize", md: "h4.fontSize" },
                borderBottom: "4px solid",
              }}
            >
              自己PR
            </Typography>
            <Typography
              component={"p"}
              sx={{
                padding: "8px 16px",
                fontSize: { xs: "p.fontSize", md: "h5.fontSize" },
                lineHeight: "2.5rem",
              }}
            >
              私はリーダーシップを発揮できる人材です。学生時代にサークル長として運営に携わった際に、リーダーシップを養うことができました。サークル長を務めていたフットボールサークルでは、練習場所や時間が取れないことや、連携を取り切れていないことが問題でした。そこで、大学生側に掛け合い週に2回の練習場所を確保し、時間を決め活動するようにメンバーに声掛けを行いました。さらに週末明けに今週の活動の詳細をメンバーに配信することで連携強化に努めた結果、サークル加入率を前年度の3倍まで伸ばすことができました。問題にしっかりと焦点を当て、迅速に対応していき、周りを良い意味で巻き込んでいくリーダーシップを御社でも活かしていきたいと考えております
            </Typography>
          </Stack>
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <Typography
              component={"h3"}
              sx={{
                fontSize: { xs: "h5.fontSize", md: "h4.fontSize" },
                borderBottom: "4px solid",
              }}
            >
              リンク集
            </Typography>
            <Typography
              component={"ul"}
              sx={{
                padding: "8px 16px",
                fontSize: { xs: "p.fontSize", md: "h5.fontSize" },
                lineHeight: "2.5rem",
              }}
            >
              <Typography component={"li"}>
                <Typography
                  component={"a"}
                  href="https://mui.com/material-ui/api/button/"
                  sx={{
                    fontSize: { xs: "p.fontSize", md: "h6.fontSize" },
                  }}
                >
                  X
                </Typography>
              </Typography>
            </Typography>
          </Stack>
        </Stack>

        <Typography
          component={"h3"}
          sx={{
            fontSize: { xs: "h5.fontSize", md: "h4.fontSize" },
            borderBottom: "4px solid",
            color: "primary.main",
          }}
        >
          作品一覧
        </Typography>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            marginY: "16px",
            paddingX: "32px",
          }}
        >
          {Array.from(Array(3)).map((_, index) => (
            <Grid item xs={4} sm={4} md={3} key={index}>
              <Typography
                component={"a"}
                href={`../work/${index}`}
                sx={{
                  textDecoration: "none",
                }}
              >
                <Item>
                  <Stack
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      component={"img"}
                      src="/event_1.png"
                      sx={{
                        width: "60%",
                      }}
                    />
                  </Stack>
                  <Stack
                    sx={{
                      backgroundColor: "gray.light",
                      padding: "8px 16px",
                    }}
                  >
                    <Typography
                      component={"h4"}
                      sx={{
                        fontSize: "h6.fontSize",
                        marginBottom: "8px",
                      }}
                    >
                      あああ
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "p.fontSize",
                        wordBreak: "break-word",
                      }}
                    >
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </Typography>
                  </Stack>
                </Item>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}));
