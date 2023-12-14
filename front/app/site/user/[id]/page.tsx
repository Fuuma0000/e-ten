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

export default function User({ params }: { params: { id: string } }) {
  return (
    <Box>
      <Stack
        sx={{
          width: "90vw",
          marginX: "auto",
          marginTop: "24px",
          marginBottom: "160px",
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
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: { md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: "24px", md: "104px" },
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
            <Stack>
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
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  希望職種：WEBフロント
                </Typography>
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
          <Stack>
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
              fontSize: {xs: "p.fontSize", md:"h5.fontSize"},
              lineHeight: "2.5rem"
             }}
            >
              私はリーダーシップを発揮できる人材です。学生時代にサークル長として運営に携わった際に、リーダーシップを養うことができました。サークル長を務めていたフットボールサークルでは、練習場所や時間が取れないことや、連携を取り切れていないことが問題でした。そこで、大学生側に掛け合い週に2回の練習場所を確保し、時間を決め活動するようにメンバーに声掛けを行いました。さらに週末明けに今週の活動の詳細をメンバーに配信することで連携強化に努めた結果、サークル加入率を前年度の3倍まで伸ばすことができました。問題にしっかりと焦点を当て、迅速に対応していき、周りを良い意味で巻き込んでいくリーダーシップを御社でも活かしていきたいと考えております
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
