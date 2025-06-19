import { Avatar, Box, Button, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import MessageText from "./MessageText";
import { useSelector } from "react-redux";

const MessageContent = ({ client, conversation, messages }) => {
  const [input, setInput] = useState("");
  const auth = useSelector((state) => state.auth);
  const contentBodyRef = useRef(null); // Tham chiếu đến vùng chứa tin nhắn

  const handleSend = () => {
    if (client && input.trim()) {
      const token = localStorage.getItem("token"); // Hoặc từ state/context

      const message = {
        senderEmail: auth.email,
        content: input,
        conversationId: conversation.id,
      };

      // Gửi tin nhắn đến server với token trong header
      client.send(
        "/app/sendMessage",
        { Authorization: `Bearer ${token}` }, // Header chứa token
        JSON.stringify(message)
      );
      // Xóa nội dung input sau khi gửi
      setInput("");
    }
  };

  // Cuộn đến cuối mỗi khi messages thay đổi
  useEffect(() => {
    if (contentBodyRef.current) {
      const contentBody = contentBodyRef.current;
      const isOverflowing =
        contentBody.scrollHeight > contentBody.clientHeight; // Kiểm tra overflow

      if (isOverflowing) {
        // Cuộn đến cuối chỉ trong content-body bằng cách dùng scrollTop
        contentBody.scrollTop = contentBody.scrollHeight;
      }
    }
  }, [messages]); // Khi messages thay đổi, kiểm tra và cuộn nếu cần

  if (conversation) {
    return (
      <div>
        <div
          className="cotent-header px-3 py-2"
          style={{ borderBottom: "1px solid #dddd", width: "100%" }}
        >
          <Stack direction={"row"} sx={{ justifyContent: "start" }}>
            <Stack direction={"row"} spacing={2}>
              <Avatar
                sx={{ width: 55, height: 55 }}
                alt="Remy Sharp"
                src={conversation.customer.avatar}
              />
              <Box>
                <div className="body-name ">
                  <h6
                    style={{
                      fontWeight: "700",
                      fontSize: "18px",
                      marginBottom: 0,
                    }}
                  >
                    {conversation.customer.name}
                  </h6>
                </div>
                <Stack
                  className="body-name"
                  spacing={1}
                  direction={"row"}
                  sx={{ alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "green",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <p style={{ fontSize: "15px", marginBottom: "0" }}>
                    Đang hoạt động
                  </p>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </div>

        <div
          ref={contentBodyRef} // Gắn ref cho content-body
          className="content-body mt-3 px-2"
          style={{
            height: "420px",  // Đảm bảo chiều cao vùng chứa tin nhắn cố định
            overflowY: "auto", // Cho phép cuộn dọc trong content-body
            overflowX: "hidden", // Vô hiệu hóa cuộn ngang
            scrollBehavior: "smooth", // Cuộn mượt mà
          }}
        >
          {messages &&
            messages.map((item) => (
              <MessageText
                key={item.id} // Đảm bảo mỗi item có một key duy nhất
                avatar={item.avatar}
                text={item.content}
                yourself={item.sender === auth.email}
              />
            ))}
        </div>

        <div
          className="content-input py-4 px-4"
          style={{ borderTop: "1px solid #dddd" }}
        >
          <Form>
            <Stack direction={"row"}>
              <Form.Control
                type="text"
                placeholder="Nhập tin nhắn"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleSend}>
                <SendIcon />
              </Button>
            </Stack>
          </Form>
        </div>
      </div>
    );
  }
};

export default MessageContent;
