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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addHeaderMiddleware, handleExpiredToken } from "@/lib/apiClient";
import axios, { AxiosResponse } from "axios";

type USER = {
  user_id: number;
  icon_url: string;
  username: string;
  course: string;
  enrollment_year: number;
  graduation_year: number;
  job: [];
  is_job_hunt_completed: boolean;
  "e-mail": string;
  self_introduction: string;
  urls: [];
  works: WORK[];
};

type WORK = {
  work_id: any;
  name: any;
  catch_copy: any;
  genres: any;
  technologies: TECHNOLOGIE[];
  icon_url: []
};

type TECHNOLOGIE = {
  id: any;
  name: any;
};

export default function User() {
  const [detailProfileData, setDetailProfileData] = useState<USER>();
  const [errorMessage, setErrorMessage] = useState();

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const asyncWrapper = async () => {
      const dynamicRoutingId = params.id;
      const axiosClient = addHeaderMiddleware();

      try {
        const response = await axiosClient
          .get(`/profiles/${dynamicRoutingId}`, { withCredentials: true })
          .then((res: AxiosResponse<USER>) => {
            const { data, status } = res;
            return data;
          });

        // TODO:確認したら消す
        console.log("-------------------------------");
        console.log(response);
        console.log("-------------------------------");

        setDetailProfileData(response);
      } catch (e) {
        // TODO:エラーでたらログインページに返すのにエラー詰める必要ある？
        if (axios.isAxiosError(e) && e.response) {
          if (
            e.response.status === 401 &&
            e.response.data.message === "トークンの有効期限が切れています"
          ) {
            const response = await handleExpiredToken(
              `/profiles/${dynamicRoutingId}`,
              "GET"
            );

            console.log("-----再取得したレスポンス-----");
            console.log(response);

            if (response.status === "OK") {
              setDetailProfileData(response.responseData);
            } else {
              // ここが発火することはないはず
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
                {detailProfileData?.username}
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
                  コース：{detailProfileData?.course}
                </Typography>
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  入学・卒業年次：{detailProfileData?.enrollment_year}〜
                  {detailProfileData?.graduation_year}
                </Typography>
                {
                  detailProfileData?.job.length ?
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
                      {detailProfileData?.job.map((value, index) => (
                        <Typography
                          component={"li"}
                          sx={{
                            fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                          }}
                        >
                          {value}
                        </Typography>
                      ))}
                    </Typography>
                  </Stack>:""
                }
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  就活状況：
                  {detailProfileData?.is_job_hunt_completed
                    ? "就活中"
                    : "内定済み"}
                </Typography>
                <Typography
                  component={"p"}
                  sx={{
                    fontSize: { xs: "h6.fontSize", md: "h4.fontSize" },
                  }}
                >
                  メールアドレス：{detailProfileData?.["e-mail"]}
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
              {detailProfileData?.self_introduction}
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
              {detailProfileData?.urls.map((value, index) => (
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
              ))}
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
          {detailProfileData?.works.map((value, index) => (
            <Grid item xs={4} sm={4} md={3} key={index}>
              <Typography
                component={"a"}
                href={`../work/${value.work_id}`}
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
                      {value.name}
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "p.fontSize",
                        wordBreak: "break-word",
                      }}
                    >
                      {value.catch_copy}
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
