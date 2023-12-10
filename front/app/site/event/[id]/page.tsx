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
import React from "react";

export default function Event({ params }: { params: { id: string } }) {
  const [value, setValue] = React.useState(0);

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
          marginBottom: "160px"
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
          ＋E展 2024・Spring
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
              2024年2月2日（Mon）0:00 ～ 2024年2月3日（Sat）23:59
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
                  width: "100%",
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
                  sx={{ width: { xs: "90%", md: "40%" } }}
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
                  sx={{ width: { xs: "90%", md: "40%" } }}
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
            {Array.from(Array(8)).map((_, index) => (
              <Grid item xs={4} sm={4} md={3} key={index}>
                <Item>
                  <Stack
                    sx={{
                      alignItems: "center"
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
                      padding: "8px 16px"
                    }}
                  >
                    <Typography
                      component={"h4"}
                      sx={{
                        fontSize: "h6.fontSize",
                        marginBottom: "8px"
                      }}
                    >
                      あああ
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "p.fontSize",
                        wordBreak: "break-word"
                      }}
                    >
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </Typography>
                  </Stack>
                </Item>
              </Grid>
            ))}
          </Grid>
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
              <Stack
                sx={{
                  flexDirection: { md: "row" },
                  width: "100%",
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
                  sx={{ width: { xs: "90%", md: "40%" } }}
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
                  sx={{ width: { xs: "90%", md: "40%" } }}
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
            {Array.from(Array(8)).map((_, index) => (
              <Grid item xs={4} sm={4} md={3} key={index}>
                <Item>
                  <Stack
                    sx={{
                      alignItems: "center"
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
                      padding: "8px 16px"
                    }}
                  >
                    <Typography
                      component={"h4"}
                      sx={{
                        fontSize: "h6.fontSize",
                        marginBottom: "8px"
                      }}
                    >
                      あああ
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "p.fontSize",
                        wordBreak: "break-word"
                      }}
                    >
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </Typography>
                  </Stack>
                </Item>
              </Grid>
            ))}
          </Grid>
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
