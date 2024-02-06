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
import { addHeaderMiddleware, handleExpiredToken } from "@/lib/apiClient";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { AspectRatio } from "@mui/icons-material";

type WORK = {
  work_id: any;
  name: any;
  catch_copy: any;
  description: any;
  genres: any;
  images: string[];
  is_bookmarked: boolean;
  movie_url: any;
  technologies: TECHNOLOGIE[];
  users: USER[];
  works_url: any;
};

type TECHNOLOGIE = {
  id: any;
  name: any;
};

type USER = {
  user_id: Number;
  username: string;
  role: string;
};

// 認証を一貫して通せないとデータが取得出来ずにエラーによりコンポーネントが描画されなくなってしまうのでpropsに渡した状態で留めています
export default function Event() {
  const [detailWorksData, setDetailWorksData] = useState<WORK>();
  const [errorMessage, setErrorMessage] = useState();
  const [isBookMarked, setIsBookMarked] = useState(true);

  const params = useParams();
  const router = useRouter();

  const clickBookMark = async () => {
    const newBookMark = !isBookMarked;
    setIsBookMarked(newBookMark);

    // bookmark用にworks_idを取得する
    const dynamicRoutingId = params.id;
    const axiosClient = addHeaderMiddleware();

    try {
      const response = await axiosClient.post(
        `/bookmarks/${dynamicRoutingId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setDetailWorksData((state) => ({
        work_id: state?.work_id,
        name: state?.name,
        catch_copy: state?.catch_copy,
        description: state?.description,
        genres: state?.genres,
        images: state!.images,
        is_bookmarked: !state?.is_bookmarked,
        movie_url: state?.movie_url,
        technologies: state!.technologies,
        users: state!.users,
        works_url: state?.works_url,
      }));
    } catch (e) {
      // TODO:エラーでたらログインページに返すのにエラー詰める必要ある？
      if (axios.isAxiosError(e) && e.response) {
        // アクセストークンの有効期限が切れていた時
        if (
          e.response.status === 401 &&
          e.response.data.message === "トークンの有効期限が切れています"
        ) {
          const response = await handleExpiredToken(
            `/bookmarks/${dynamicRoutingId}`,
            "POST",
            {}
          );

          console.log("-----再取得したレスポンス-----");
          console.log(response);
        } else {
          console.log(e.response.data);
          setErrorMessage(e.response.data);
        }
      }
    }
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      const dynamicRoutingId = params.id;
      const axiosClient = addHeaderMiddleware();

      try {
        const response = await axiosClient
          .get(`/works/${dynamicRoutingId}`, {
            withCredentials: true,
          })
          .then((res: AxiosResponse<WORK>) => {
            const { data, status } = res;
            return data;
          });

        // TODO:確認したら消す
        console.log("----------------------");
        console.log(response);
        console.log("----------------------");

        setDetailWorksData(response);
      } catch (e) {
        // TODO:エラーでたらログインページに返すのにエラー詰める必要ある？
        if (axios.isAxiosError(e) && e.response) {
          if (
            e.response.status === 401 &&
            e.response.data.message === "トークンの有効期限が切れています"
          ) {
            const response = await handleExpiredToken(
              `/works/${dynamicRoutingId}`,
              "GET"
            );

            console.log("-----再取得したレスポンス-----");
            console.log(response);

            if (response.status === "OK") {
              setDetailWorksData(response.responseData);
            } else {
              // 多分発火せん
              setErrorMessage(response.responseData);
            }
          } else {
            console.log(e.response.data);
            setErrorMessage(e.response.data);

            router.push("/");
          }
        }
      }
    };

    asyncWrapper();
  }, []);

  return (
    <Box>
      <IconButton onClick={clickBookMark}>
        <BookmarkIcon
          sx={{
            width: { xs: "58px", sm: "80px", md: "100px" },
            height: { xs: "58px", sm: "80px", md: "100px" },
            color: !detailWorksData?.is_bookmarked
              ? "gray.dark"
              : "primary.main",
            position: "fixed",
            bottom: { xs: "16px", md: "24px" },
            right: { xs: "8px", md: "24px" },
            zIndex: 1,
          }}
        />
      </IconButton>
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
            fontSize: { xs: "h5.fontSize", md: "h2.fontSize" },
          }}
        >
          {detailWorksData?.name}
        </Typography>
        {detailWorksData?.movie_url ? (
          <iframe
            src={detailWorksData.movie_url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              aspectRatio: "16 / 9",
            }}
          ></iframe>
        ) : (
          ""
        )}
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
            {detailWorksData?.genres[0]}
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
          {detailWorksData?.technologies != undefined &&
          detailWorksData?.technologies.length
            ? detailWorksData.technologies.map((value) => (
                <Typography
                  component={"p"}
                  sx={{
                    textAlign: "center",
                    fontSize: { xs: "p", md: "h5.fontSize" },
                  }}
                >
                  {value.name}
                </Typography>
              ))
            : ""}
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
            {detailWorksData?.works_url}
          </Typography>
        </Stack>
        <Typography
          component={"p"}
          sx={{
            marginTop: "24px",
            fontSize: { xs: "p", md: "h5.fontSize" },
          }}
        >
          {detailWorksData?.catch_copy}
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
        {detailWorksData?.images.length ? (
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
              {detailWorksData?.images.map((value, index) => (
                <Typography
                  component={"img"}
                  src={value}
                  sx={{
                    width: "100%",
                    aspectRatio: "5 / 3",
                  }}
                />
              ))}
            </Typography>
          </Stack>
        ) : (
          ""
        )}

        <Typography
          component={"p"}
          sx={{
            marginTop: "24px",
            fontSize: { xs: "p", md: "h5.fontSize" },
          }}
        >
          {detailWorksData?.description}
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
          {detailWorksData?.users.map((value, index) => (
            <Grid item xs={4} sm={4} md={4}>
              <Typography
                component={"a"}
                href={`../user/${value.user_id}`}
                sx={{
                  textDecoration: "none",
                }}
              >
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
                    &ensp; {value.username}
                  </Typography>
                  <Typography
                    component={"p"}
                    sx={{
                      marginTop: "8px",
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
                    &ensp; {value.role}
                  </Typography>
                </Paper>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.query;

//   const axiosClient = addHeaderMiddleware();

//   const detailWorkData = await axiosClient.get(`/works/${id}`);
//   return {
//     props: {
//       detailWorkData: detailWorkData.data
//     }
//   }
// }
