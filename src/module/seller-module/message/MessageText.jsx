import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";

const MessageText = ({ color, avatar, text, yourself }) => {
  // Hàm getShort để cắt chuỗi khi nó dài hơn 100 ký tự
  

  return (
    <>
      {yourself ? (
        <Stack
          direction={"row"}
          sx={{ justifyContent: yourself ? "end" : "start", my: 3 }}
          spacing={1}
        >
          <Typography
            sx={{
              backgroundColor: "rgba(238,240,242,1)",
              padding: "2px 10px",
              borderRadius: "10px",
              maxWidth: "50%",
            }}
            variant="body1"
            color="initial"
          >
            {text} {/* Cắt chuỗi nếu nó dài hơn 100 ký tự */}
          </Typography>
          <Avatar sx={{ width: 30, height: 30 }} alt="User" src={avatar} />
        </Stack>
      ) : (
        <Stack
          direction={"row"}
          sx={{ justifyContent: yourself ? "end" : "start", my: 3 }}
          spacing={1}
        >
          <Avatar sx={{ width: 30, height: 30 }} alt="User" src={avatar} />
          <Typography
            sx={{
              backgroundColor: "rgba(238,240,242,1)",
              padding: "2px 10px",
              borderRadius: "10px",
              maxWidth: "50%",
            }}
            variant="body1"
            color="initial"
          >
            {text} {/* Cắt chuỗi nếu nó dài hơn 100 ký tự */}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default MessageText;
