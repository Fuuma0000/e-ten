"use client";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  FormLabel,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { addHeaderMiddleware, handleExpiredToken } from "@/lib/apiClient";
import { link } from "fs";
import { useParams, useRouter } from "next/navigation";

type JOBS = {
  id: any;
  name: any;
};

export default function MyProfileSet() {
  const [jobs, setJobs] = useState<JOBS[]>([]);
  const [searchJobs, setSearchJobs] = useState<Number[]>([]);
  const [linkNum, setlinkNum] = useState(1);
  const [myProfileData, setMyProfileData] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const router = useRouter();

  useEffect(() => {
    const axiosClient = addHeaderMiddleware();

    const asyncWrapper = async () => {
      try {
        const myProfileResponse = await axiosClient.get("/myprofile", {
          withCredentials: true,
        });
        const jobsResponse = await axiosClient
          .get(`/events/jobs`, { withCredentials: true })
          .then((res: AxiosResponse<JOBS[]>) => {
            const { data, status } = res;
            return data;
          });

        console.log("--------------------------------");
        console.log(myProfileResponse);
        console.log("--------------------------------");
        setJobs(jobsResponse);
        setMyProfileData(myProfileResponse.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          if (
            e.response.status === 401 &&
            e.response.data.message === "トークンの有効期限が切れています"
          ) {
            const response = await handleExpiredToken("/myprofile", "GET");

            console.log("-----再取得したレスポンス-----");
            console.log(response);

            if (response.status === "OK") {
              setMyProfileData(response.responseData);
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

  const addLinkForm = () => {
    const nextLinks = [...links];
    nextLinks.push({ name: "", url: "" });
    setLinks(nextLinks);
  };

  const chengeLinkName = (index: number, newName: string) => {
    const newLinks = [...links];
    newLinks[index].name = newName;
    setLinks(newLinks);
  };
  const chengeLinkUrl = (index: number, newUrl: string) => {
    const newLinks = [...links];
    newLinks[index].url = newUrl;
    setLinks(newLinks);
  };

  const [image, setImage] = useState<FileList | null>(null);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [cource, setCource] = useState(0);
  const [enrollmentYear, setEnrollmentYear] = useState("2020");
  const [graduationYear, setGraduationYear] = useState("2024");
  const [job, setJob] = useState(0);
  const [jobHuntState, setJobHuntState] = useState(false);
  const [pr, setPr] = useState("");
  const [links, setLinks] = useState([{ name: "", url: "" }]);
  const clickHandler = async () => {
    console.log("画像：");
    console.log(image);
    console.log("ユーザー名：" + name);
    console.log("メールアドレス：" + mail);
    console.log("コーズ：" + cource);
    console.log("入学年次：" + enrollmentYear);
    console.log("卒業年次：" + graduationYear);
    console.log("希望職種：");
    console.log(searchJobs);
    console.log("就活状況：" + jobHuntState);
    console.log("自己PR：" + pr);
    console.log("リンク集：");
    console.log(links);

    // ユーザ情報変更処理
    try {
      console.log("ここまで実行されてる1");
      const axiosClient = addHeaderMiddleware();

      console.log("ここまで実行されてる2");

      const response = await axiosClient.post(
        `/profiles/1`,
        {
          user_name: name,
          email: mail,
          course_id: cource,
          enrollment_year: enrollmentYear,
          graduation_year: graduationYear,
          jobs_id: job,
          is_job_hunt_completed: jobHuntState,
          self_introduction: pr,
          urls: links,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      console.log("ここまで実行されてる3");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        console.log(e);
      }
    }
  };

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
        <Typography
          component={"h1"}
          sx={{
            fontSize: { xs: "h5.fontSize", md: "h3.fontSize" },
          }}
        >
          MyProfile編集
        </Typography>
        <Typography
          component={"input"}
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files);
          }}
        />
        <TextField
          id="outlined-password-input"
          label="ユーザー名"
          type="text"
          autoComplete="current-password"
          sx={{
            width: "100%",
            marginBottom: "8px",
          }}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          id="outlined-password-input"
          label="メールアドレス"
          type="text"
          autoComplete="current-password"
          sx={{
            width: "100%",
            marginBottom: "8px",
          }}
          value={mail}
          onChange={(e) => {
            setMail(e.target.value);
          }}
        />
        <Typography
          component={"div"}
          sx={{
            width: "100%",
          }}
        >
          <InputLabel id="course-select-label">コース</InputLabel>
          <Select
            labelId="course-select-label"
            id="course-select"
            label="course"
            sx={{
              width: "100%",
            }}
            defaultValue={cource}
            onChange={(e) => {
              setCource(Number(e.target.value));
            }}
          >
            <MenuItem value={0}>IT</MenuItem>
            <MenuItem value={1}>WEB</MenuItem>
            <MenuItem value={2}>経営情報</MenuItem>
            <MenuItem value={3}>国際エンジニア</MenuItem>
          </Select>
        </Typography>
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
          }}
        >
          <Typography
            component={"div"}
            sx={{
              width: "100%",
              marginRight: "8px",
            }}
          >
            <InputLabel id="enrollment_year-select-label">入学年次</InputLabel>
            <Select
              labelId="enrollment_year-select-label"
              id="enrollment_year-select"
              label="enrollment_year"
              sx={{
                width: "100%",
              }}
              defaultValue={enrollmentYear}
              onChange={(e) => {
                setEnrollmentYear(e.target.value);
              }}
            >
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </Typography>

          <Typography
            component={"div"}
            sx={{
              width: "100%",
              marginLeft: "8px",
            }}
          >
            <InputLabel id="graduation_year-select-label">卒業年次</InputLabel>
            <Select
              labelId="graduation_year-select-label"
              id="graduation_year-select"
              label="graduation_year"
              sx={{
                width: "100%",
              }}
              defaultValue={graduationYear}
              onChange={(e) => {
                setGraduationYear(e.target.value);
              }}
            >
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2026}>2026</MenuItem>
              <MenuItem value={2027}>2027</MenuItem>
            </Select>
          </Typography>
        </Stack>

        <Autocomplete
          multiple
          limitTags={3}
          id="multiple-jobs-tags"
          isOptionEqualToValue={(option, v) => option.id === v.id}
          options={jobs}
          getOptionLabel={(option) => option.name}
          defaultValue={[]}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            );
          }}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.id}
                label={option.name}
              />
            ));
          }}
          renderInput={(params) => (
            <TextField {...params} label="希望職種" placeholder="Favorites" />
          )}
          sx={{ width: "80%" }}
          onChange={(event, newValue) => {
            let newSearchJobs: Number[] = [];
            for (const job of newValue){
              newSearchJobs.push(job.id);
            }
            console.log(newSearchJobs)
          }}
        />

        <InputLabel id="is_job_hunt_completed-label">就活状況</InputLabel>
        <RadioGroup
          aria-labelledby="is_job_hunt_completed-label"
          name="radio-buttons-group"
          defaultValue={jobHuntState}
          onChange={(e) => {
            setJobHuntState(Boolean(e.target.value));
          }}
        >
          <FormControlLabel value={false} control={<Radio />} label="就活中" />
          <FormControlLabel value={true} control={<Radio />} label="内定済み" />
        </RadioGroup>

        <InputLabel id="pr-label">自己PR</InputLabel>
        <TextareaAutosize
          id="pr"
          style={{
            height: "400px",
            lineHeight: "1.5",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
          defaultValue={pr}
          onChange={(e) => {
            setPr(e.target.value);
          }}
        ></TextareaAutosize>

        <InputLabel id="pr-label">link集</InputLabel>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20%" }}>リンク名</TableCell>
                <TableCell align="center">URL</TableCell>
              </TableRow>
            </TableHead>

            {(() => {
              const items = [];
              for (let i = 0; i < links.length; i++) {
                items.push(
                  <TableRow id={"link-" + i} key={i}>
                    <TableCell>
                      <TextField
                        id={"link-name" + i}
                        label={"リンク名" + i}
                        type="text"
                        sx={{
                          width: "100%",
                        }}
                        defaultValue={links[i].name}
                        onChange={(e) => {
                          chengeLinkName(i, e.target.value);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id={"link-URL" + i}
                        label={"URL" + i}
                        type="text"
                        sx={{
                          width: "100%",
                        }}
                        defaultValue={links[i].url}
                        onChange={(e) => {
                          chengeLinkUrl(i, e.target.value);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              }
              return <TableBody>{items}</TableBody>;
            })()}
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={addLinkForm}
                    sx={{
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      backgroundColor: "#FFF",
                      color: "#898989",
                      border: "2px solid #CBCBCB",
                      boxShadow: 0,
                      ":hover": {
                        backgroundColor: "primary.main",
                        color: "#FFF",
                        borderColor: "primary.light",
                        boxShadow: 0,
                      },
                      ":active": {
                        backgroundColor: "primary.main",
                        color: "#FFF",
                        borderColor: "primary.light",
                        boxShadow: 0,
                      },
                    }}
                  >
                    追加
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <Typography
          component={"div"}
          sx={{
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={clickHandler}
            sx={{
              width: "70%",
              marginTop: "24px",
              fontSize: { xs: "1rem", md: "1.2rem" },
              backgroundColor: "primary.main",
              color: "#FFF",
              border: "2px solid",
              borderColor: "primary.light",
              boxShadow: 0,
              ":hover": {
                boxShadow: 0,
              },
              ":active": {
                backgroundColor: "primary.main",
                color: "#FFF",
                borderColor: "primary.light",
                boxShadow: 0,
              },
            }}
          >
            編集
          </Button>
        </Typography>
      </Stack>
    </Box>
  );
}
