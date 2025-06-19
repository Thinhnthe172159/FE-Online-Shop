import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { AccountBalance, MoreVert, ArrowUpward } from "@mui/icons-material";

const TotalIncome = ({ amount }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#6C63FF", // Màu tím nền
      color: "white",
      borderRadius: 3,
      height: "130px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Hiệu ứng vòng tròn nền */}
    <Box
      sx={{
        position: "absolute",
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
    />

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <AccountBalance
          sx={{
            fontSize: 30,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: 1,
            borderRadius: "5px",
            marginRight: 1,
          }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {amount} đơn đăng ký mới
          </Typography>
        </Box>
      </Box>
      <IconButton sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
        <MoreVert />
      </IconButton>
    </Box>
  </Paper>
);

export default TotalIncome;
