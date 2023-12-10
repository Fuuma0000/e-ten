"use client"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
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
            borderBottom: "2px solid",
            borderColor: "gray.dark",
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
          参加作品
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          参加学生
        </CustomTabPanel>
      </Stack>
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
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
      {value === index && (
        <Box sx={{ paddingY: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
