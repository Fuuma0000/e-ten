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
  styled,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { addHeaderMiddleware, handleExpiredToken } from "@/lib/apiClient";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

type BOOKMARKS = {
  booksmarks_id: number;
  works_id: number;
  works: WORK;
};

type WORK = {
  name: string;
  icon_url: string;
  catch_copy: string;
  genres: [];
  technologies: [];
};

export default function Event() {
  const [value, setValue] = React.useState(0);
  const [bookmarkData, setBookmarkData] = useState<BOOKMARKS[]>([]);
  const [errorMessage, setErrorMessage] = useState();

  const router = useRouter();

  useEffect(() => {
    const asyncWrapper = async () => {
      const axiosClient = addHeaderMiddleware();

      try {
        const response = await axiosClient
          .get("/bookmarks", {
            withCredentials: true,
          })
          .then((res: AxiosResponse<BOOKMARKS[]>) => {
            const { data, status } = res;
            return data;
          });
        console.log("--------------------------------");
        console.log(response);
        console.log("--------------------------------");

        setBookmarkData(response);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          if (
            e.response.status === 401 &&
            e.response.data.message === "トークンの有効期限が切れています"
          ) {
            const response = await handleExpiredToken("/bookmarks", "GET");

            console.log("-----再取得したレスポンス-----");
            console.log(response);

            if (response.status === "OK") {
              setBookmarkData(response.responseData);
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          component={"div"}
          sx={{
            borderBottom: "1px solid",
            borderColor: "gray.main",
            marginBottom: "24px",
          }}
        >
          <Typography
            component={"h2"}
            sx={{
              fontSize: { xs: "h3.fontSize", md: "h2.fontSize" },
            }}
          >
            Book Mark
          </Typography>
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
          {bookmarkData.map((value, index) => (
            <Grid item xs={4} sm={4} md={3} key={index}>
              <Typography
                      component={"a"}
                      href={`./work/${value.works_id}`}
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
                              display: "-webkit-box",
                              fontSize: "h6.fontSize",
                              marginBottom: "8px",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                              overflow: "hidden",
                            }}
                          >
                            {value.works.name}
                          </Typography>
                          <Typography
                            component={"p"}
                            sx={{
                              display: "-webkit-box",
                              fontSize: "p.fontSize",
                              wordBreak: "break-word",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                              minHeight: "3em",
                            }}
                          >
                            {value.works.catch_copy}
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingY: 3 }}>{children}</Box>}
    </div>
  );
}

const top100Films = [
  { title: "IT", key: 1 },
  { title: "WEB", key: 2 },
  { title: "経営情報", key: 3 },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}));

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.query;

//   const axiosClient = addHeaderMiddleware();

//   const eventsData = await axiosClient.get(`/events/${id}/works`);
//   const profilesData = await axiosClient.get(`/events/${id}/students`);
//   // TODO:技術一覧のエンドポイントからデータを取得する
//   return {
//     props: {
//       eventsData: eventsData.data,
//       usersData: profilesData.data
//     }
//   }
// }
