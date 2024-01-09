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
import { GetServerSideProps } from "next";
import { addHeaderMiddleware } from "@/lib/apiClient";
;

// 認証を一貫して通せないとデータが取得出来ずにエラーによりコンポーネントが描画されなくなってしまうのでpropsに渡した状態で留めています
export default function Event({ detailWorkData }: any) {
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
        <Typography
          component={"h2"}
          sx={{
            fontSize: {xs: "h5.fontSize", md:"h2.fontSize"},
          }}
        >
          Welking Helper
        </Typography>
        <Typography
          component={"video"}
          controls
          src="https://www.youtube.com/watch?v=0mvrFC7nKyY"
        />
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <Typography
            component={"div"}
            sx={{
              backgroundColor: "primary.main",
              color: "gray.light",
              padding: { xs: "4px 8px", md: "8px 16px" },
              borderRadius: "8px",
              fontWeight: { md: "bold" },
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            ジャンル
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "center",
              fontSize: { xs: "p", md: "h5.fontSize" },
            }}
          >
            IT
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <Typography
            component={"div"}
            sx={{
              backgroundColor: "primary.main",
              color: "gray.light",
              padding: { xs: "4px 8px", md: "8px 16px" },
              borderRadius: "8px",
              fontWeight: { md: "bold" },
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            技術
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "center",
              fontSize: { xs: "p", md: "h5.fontSize" },
            }}
          >
            java
          </Typography>
          <Typography
            component={"p"}
            sx={{
              textAlign: "center",
              fontSize: { xs: "p", md: "h5.fontSize" },
            }}
          >
            go
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <Typography
            component={"div"}
            sx={{
              backgroundColor: "primary.main",
              color: "gray.light",
              padding: { xs: "4px 8px", md: "8px 16px" },
              borderRadius: "8px",
              fontWeight: { md: "bold" },
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            作品リンク
          </Typography>
          <Typography
            component={"a"}
            href="/"
            sx={{
              textAlign: "center",
              fontSize: { xs: "p", md: "h5.fontSize" },
            }}
          >
            http://localhost:3000/
          </Typography>
        </Stack>
        <Typography
          component={"p"}
          sx={{
            marginTop: "24px",
            fontSize: { xs: "p", md: "h5.fontSize" },
          }}
        >
          最先端の生成 AI
          モデルを活用して、あらゆる音楽からプロダンサーの振り付けを生成します。熟練したダンサーやアニメーターが時間と労力をかけて振り付けを制作するプロセスを自動化します。
        </Typography>
        <Typography
          component={"p"}
          sx={{
            borderBottom: "8px solid",
            paddingLeft: "8px",
            fontSize: "h4.fontSize",
            fontWeight: "bold",
            marginTop: "48px",
            color: "primary.main",
          }}
        >
          詳細情報
        </Typography>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "16px",
            border: "8px solid",
            borderColor: "primary.main",
            borderRadius: "16px",
            backgroundColor: "primary.light",
            paddingY: "16px",
          }}
        >
          <Typography
            component={"ul"}
            sx={{
              display: "flex",
              overflowX: "scroll",
              whiteSpace: "nowrap",
              WebkitOverflowScrolling: "touch",
              listStyle: "none",
              width: "80%",
              aspectRatio: "5 / 3",
            }}
          >
            <Typography
              component={"img"}
              src="/event_1.png"
              sx={{
                width: "100%",
                aspectRatio: "5 / 3",
              }}
            />

            <Typography
              component={"img"}
              src="/event_1.png"
              sx={{
                width: "100%",
                aspectRatio: "5 / 3",
              }}
            />
            <Typography
              component={"img"}
              src="/event_1.png"
              sx={{
                width: "100%",
                aspectRatio: "5 / 3",
              }}
            />
          </Typography>
        </Stack>

        <Typography
          component={"p"}
          sx={{
            marginTop: "24px",
            fontSize: { xs: "p", md: "h5.fontSize" },
          }}
        >
          最先端の生成 AI
          モデルを活用して、あらゆる音楽からプロダンサーの振り付けを生成します。熟練したダンサーやアニメーターが時間と労力をかけて振り付けを制作するプロセスを自動化します。最先端の生成
          AI
          モデルを活用して、あらゆる音楽からプロダンサーの振り付けを生成します。熟練したダンサーやアニメーターが時間と労力をかけて振り付けを制作するプロセスを自動化します。
          <br />
          <br />
          2023年 5 月に博多駅に設置された全国初の大型 LED ビジョンTHE HAKATA
          VISI-ON STAGE で知人のダンサーが 3D アバ
          ターと踊るインスタレーションに感銘を受け、常設可能なインスタレーションがあれば面白いと思い着想しました。当初は
          音楽とステージ上で踊る人の動きにあわせて踊る生成 AI
          ダンサーを実現しようと考えていました。実装を進める中で、モ
          デルの訓練や音楽の特徴抽出やダンスの動きのリアルタイムの推論には多くの計算資源が必要であることがわかり、今回の
          ハッカソンではアドホックで振り付けを生成する AI
          ダンサーを実現することにしました。
        </Typography>
        <Typography
          component={"p"}
          sx={{
            borderBottom: "8px solid",
            paddingLeft: "8px",
            fontSize: "h4.fontSize",
            fontWeight: "bold",
            marginTop: "48px",
            marginBottom: "24px",
            color: "primary.main",
          }}
        >
          メンバー
        </Typography>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            marginY: "16px",
          }}
        >
          <Grid item xs={4} sm={4} md={4}>
            <Paper
              sx={{
                padding: "16px 24px",
              }}
            >
              <Typography component={"p"}>
                <Typography
                  component={"span"}
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  名前
                </Typography>
                &ensp;
                久乗建汰
              </Typography>
              <Typography
               component={"p"}
               sx={{
                marginTop:"8px"
               }}
              >
                <Typography
                  component={"span"}
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  担当
                </Typography>
                &ensp;
                フロント画面コーディング
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}



export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  
  const axiosClient = addHeaderMiddleware();

  const detailWorkData = await axiosClient.get(`/works/${id}`);
  return {
    props: {
      detailWorkData: detailWorkData.data
    }
  }
}