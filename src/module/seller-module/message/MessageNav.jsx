import { Avatar, Box, Stack } from "@mui/material";
import React from "react";
import "./message.scss";
import { useSelector } from "react-redux";

const MessageNav = ({ data, conversation, selectConversation }) => {
  console.log(data);
  
  let auth = useSelector((state) => state.auth);
  
  if (!data) {
    data = [];
  }
  const handleSelecet = (c) =>{
    selectConversation(c)
  }

  const getShort = (s) => {
    if (s && s.length > 70) {
      return s.substring(0, 70) + "..."; // Thêm dấu "..." nếu chuỗi quá dài
    }
    return s;
  };
  return (
    <div style={{ borderRight: "1px solid #dddd", height: "600px" }}>
      <div className="nav-header">
        <h5>Các cuộc trò chuyện</h5>
      </div>

      <div className="nav-body ">
        {data.length > 0 &&
          data.map((item) => {
            return (
              <div
                className="body-item px-2 py-2"
                style={{ cursor: "pointer", backgroundColor:conversation && conversation.id == item.id ? "#cedde8" : "" }}
                onClick={() => handleSelecet(item)}
              >
                <Stack spacing={2} direction={"row"}>
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    alt="Remy Sharp"
                    src={item.customer.avatar}
                  />
                  <Box>
                    <div className="body-name">
                      <h6 style={{ fontWeight: "700" }}>{item.customer.name}</h6>
                    </div>
                    <div className="body-content">
                      <p className="mb-0" style={{ fontSize: "13px" }}>
                        {item.message.senderEmail == auth.email
                          ? "Bạn"
                          : item.customer.name}
                        : {getShort(item.message.content)}
                      </p>
                    </div>
                  </Box>
                </Stack>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MessageNav;
