import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";

const MessageText = ({ avatar, text, yourself }) => {
  return (
    <Stack
      direction={"row"}
      sx={{ 
        justifyContent: yourself ? "flex-end" : "flex-start", 
        my: 2,
        mx: 1 
      }}
      spacing={1}
    >
      {!yourself && <Avatar sx={{ width: 30, height: 30 }} alt="User" src={avatar} />}
      <Typography
        sx={{
          backgroundColor: yourself ? "#0084ff" : "#e4e6eb",
          color: yourself ? "white" : "black",
          padding: "8px 12px",
          borderRadius: "18px",
          maxWidth: "70%",
          wordBreak: "break-word"
        }}
      >
        {text}
      </Typography>
      {yourself && <Avatar sx={{ width: 30, height: 30 }} alt="User" src={avatar} />}
    </Stack>
  );
};

export default MessageText;
