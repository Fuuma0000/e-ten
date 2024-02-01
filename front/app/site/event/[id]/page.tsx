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
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect, useState } from "react";
import { addHeaderMiddleware, handleExpiredToken } from "@/lib/apiClient";
import { useParams } from "next/navigation";
import axios, { AxiosResponse } from "axios";

type EVENT = {
  id: any;
  name: any;
  start_at: any;
  end_at: any;
  icon_url: any;
  description: any;
  created_at: any;
  updated_at: any;
  deleted_at: any;
};

type WORK = {
  work_id: any;
  name: any;
  catch_copy: any;
  genres: any;
  technologies: any;
};

type STUDENT = {
  user_id: any;
  username: any;
  enrollment_year: any;
  graduation_year: any;
  job: any;
};

export default function Event() {
  const [value, setValue] = React.useState(0);
  const [eventData, setEventData] = useState<EVENT>();
  const [eventsData, setEventsData] = useState<WORK[]>();
  const [viewEventsData, setViewEventsData] = useState<WORK[][]>();
  const [eventsNum, setEventsNum] = useState(1);
  const [profilesData, setProfilesData] = useState<STUDENT[]>();
  const [viewProfilesData, setViewProfilesData] = useState<STUDENT[][]>();
  const [profilesNum, setProfilesNum] = useState(1);
  const [errorMessage, setErrorMessage] = useState();

  const params = useParams();

  // TODO:ダイナミックルーティングの値を取得する
  // それ使ってレスポンスを受け取る
  // stateに詰めて描画に使う

  useEffect(() => {
    const asyncWrapper = async () => {
      const dynamicRoutingId = params.id;
      const axiosClient = addHeaderMiddleware();

      try {
        const eventsResponse = await axiosClient
          .get(`/events/${dynamicRoutingId}/works`, { withCredentials: true })
          .then((res: AxiosResponse<WORK[]>) => {
            const { data, status } = res;
            console.log(res);
            return data;
          });
        const profilesResponse = await axiosClient
          .get(`/events/${dynamicRoutingId}/students`, {
            withCredentials: true,
          })
          .then((res: AxiosResponse<STUDENT[]>) => {
            const { data, status } = res;
            console.log(res);
            return data;
          });

        const eventResponse = await axiosClient
          .get(`/events/${dynamicRoutingId}`, { withCredentials: true })
          .then((res: AxiosResponse<EVENT>) => {
            const { data, status } = res;
            console.log(res);
            return data;
          });

        // TODO:確認したら消す
        console.log("=----------------------------");
        console.log(eventResponse);
        console.log("=----------------------------");
        console.log(eventsResponse);
        console.log("-------------------------------------------");
        console.log(profilesResponse);
        console.log("---------------------------------------------");

        setEventsData(eventsResponse);
        setProfilesData(profilesResponse);

        const sliceByNumber = (array: Array<any>, number: number) => {
          const length = Math.ceil(array.length / number);
          return new Array(length)
            .fill("")
            .map((_, i) => array.slice(i * number, (i + 1) * number));
        };

        setViewEventsData(sliceByNumber(eventsResponse, 18));
        setViewProfilesData(sliceByNumber(profilesResponse, 18));
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          // アクセストークンの有効期限が切れていた時
          // TODO:多分レスポンスそのまま詰めるとまずいはず
          if (e.response.status === 401 && e.response.data.message === "トークンの有効期限が切れています") {
            const response = await handleExpiredToken(`/events/${dynamicRoutingId}/works`, "GET");

            

          }


          console.log(e.response.data);
          setErrorMessage(e.response.data);
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
          component={"img"}
          src="/event_1.png"
          sx={{
            width: "50%",
            marginX: "auto",
            marginY: "16px",
          }}
        />
        <Typography
          component={"h2"}
          sx={{
            color: "gray.light",
            fontSize: { sx: "h6.fontSize", md: "h4.fontSize" },
            backgroundColor: "primary.main",
            paddingX: "8px",
          }}
        >
          {eventData?.description}
        </Typography>
        <Typography
          component={"div"}
          sx={{
            padding: "16px 8px",
            marginBottom: "24px",
          }}
        >
          <Stack
            direction={"row"}
            sx={{
              alignItems: "center",
              color: "gray.dark",
            }}
          >
            <CalendarMonthIcon
              sx={{
                height: { sx: "16px", md: "32px" },
                width: { sx: "16px", md: "32px" },
                color: "gray.dark",
              }}
            ></CalendarMonthIcon>
            <Typography
              component={"p"}
              sx={{
                fontSize: { sx: "p.fontSize", md: "h6.fontSize" },
                marginLeft: "8px",
              }}
            >
              {eventData?.start_at + " ～ " + eventData?.end_at}
            </Typography>
          </Stack>
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="参加作品" {...a11yProps(0)} />
            <Tab label="参加学生" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Stack
            sx={{
              paddingX: "16px",
            }}
          >
            <Typography
              component={"h3"}
              sx={{
                textAlign: "center",
                fontSize: { xs: "h5.fontSize", md: "h4.fontSize" },
                color: "gray.dark",
                letterSpacing: "1rem",
              }}
            >
              参加作品
            </Typography>
            <Stack
              sx={{
                marginY: "16px",
                padding: "24px",
                border: "2px solid",
                borderColor: "gray.main",
                borderRadius: "16px",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Stack
                sx={{
                  flexDirection: { md: "row" },
                  width: "80%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: "16px", md: "40px" },
                }}
              >
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  defaultValue={[]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ジャンル"
                      placeholder="Favorites"
                    />
                  )}
                  sx={{ width: "100%" }}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  defaultValue={[]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="技術"
                      placeholder="Favorites"
                    />
                  )}
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  fontSize: "h6.fontSize",
                  color: "gray.light",
                  width: "40%",
                }}
              >
                検索
              </Button>
            </Stack>
          </Stack>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{
              marginY: "16px",
              paddingX: "32px",
            }}
          >
            {viewEventsData != undefined  ? viewEventsData![eventsNum - 1].map((value, index) => (
              <Grid item xs={4} sm={4} md={4} key={index}>
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
                          display: "-webkit-box",
                          fontSize: "h6.fontSize",
                          marginBottom: "8px",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                        }}
                      >
                        {value.name}
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
                        {value.catch_copy}
                      </Typography>
                    </Stack>
                  </Item>
                </Typography>
              </Grid>
            )): ""}
          </Grid>
          <Stack style={{ textAlign: "center" , alignItems: "center"}}>
            <Pagination
              count={viewEventsData != undefined ?  viewEventsData?.length : 0} //総ページ数
              color="primary" //ページネーションの色
              onChange={(e, num) => setEventsNum(num)} //変更されたときに走る関数。第2引数にページ番号が入る
              page={eventsNum} //現在のページ番号
            />
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Stack
            sx={{
              paddingX: "16px",
            }}
          >
            <Typography
              component={"h3"}
              sx={{
                textAlign: "center",
                fontSize: { xs: "h5.fontSize", md: "h4.fontSize" },
                color: "gray.dark",
                letterSpacing: "1rem",
              }}
            >
              参加学生
            </Typography>
            <Stack
              sx={{
                marginY: "16px",
                padding: "24px",
                border: "2px solid",
                borderColor: "gray.main",
                borderRadius: "16px",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Autocomplete
                multiple
                limitTags={2}
                id="job"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                defaultValue={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="希望職種"
                    placeholder="Favorites"
                  />
                )}
                sx={{ width: "80%" }}
              />
              <Stack
                sx={{
                  flexDirection: { md: "row" },
                  width: "80%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: "16px", md: "40px" },
                }}
              >
                <Typography
                  component={"div"}
                  sx={{
                    width: "100%",
                    marginLeft: "8px",
                  }}
                >
                  <InputLabel id="graduation_year-select-label">
                    卒業年次
                  </InputLabel>
                  <Select
                    labelId="graduation_year-select-label"
                    id="graduation_year-select"
                    label="graduation_year"
                    defaultValue={0}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <MenuItem value={0}>全て</MenuItem>
                    <MenuItem value={2020}>2024</MenuItem>
                    <MenuItem value={2021}>2025</MenuItem>
                    <MenuItem value={2022}>2026</MenuItem>
                    <MenuItem value={2023}>2027</MenuItem>
                  </Select>
                </Typography>
                <Typography
                  component={"div"}
                  sx={{
                    width: "100%",
                    marginLeft: "8px",
                  }}
                >
                  <InputLabel id="job-hunting-state-select-label">
                    就活状況
                  </InputLabel>
                  <Select
                    labelId="job-hunting-state-select-label"
                    id="job-hunting-state-select"
                    label="job-hunting-state"
                    defaultValue={0}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <MenuItem value={0}>全て</MenuItem>
                    <MenuItem value={1}>就活中</MenuItem>
                    <MenuItem value={2}>内定済み</MenuItem>
                  </Select>
                </Typography>
              </Stack>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  fontSize: "h6.fontSize",
                  color: "gray.light",
                  width: "40%",
                }}
              >
                検索
              </Button>
            </Stack>
          </Stack>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{
              marginY: "16px",
              paddingX: "32px",
            }}
          >
            {viewProfilesData != undefined ? viewProfilesData[profilesNum - 1].map((value, index) => (
              <Grid item xs={4} sm={4} md={4} key={index}>
                <Typography
                  component={"a"}
                  href={`../user/${value.user_id}`}
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
                        {value.username}
                      </Typography>
                      <Typography
                        component={"p"}
                        sx={{
                          fontSize: "p.fontSize",
                          wordBreak: "break-word",
                        }}
                      >
                        {value.enrollment_year + " 〜 " + value.graduation_year}
                      </Typography>
                    </Stack>
                  </Item>
                </Typography>
              </Grid>
            )) : ""}
          </Grid>
          <Stack style={{ textAlign: "center" , alignItems: "center"}}>
            <Pagination
              count={viewProfilesData != undefined ?  viewProfilesData?.length : 0} //総ページ数
              color="primary" //ページネーションの色
              onChange={(e, num) => setProfilesNum(num)} //変更されたときに走る関数。第2引数にページ番号が入る
              page={profilesNum} //現在のページ番号
            />
          </Stack>
        </CustomTabPanel>
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
