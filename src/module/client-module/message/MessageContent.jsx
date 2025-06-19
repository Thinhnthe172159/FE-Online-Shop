import { Avatar, Box, Button, Stack, CircularProgress, Snackbar, Alert } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import MessageText from "./MessageText";
import { useSelector } from "react-redux";

const MessageContent = ({ client, conversation, messages }) => {
  const [input, setInput] = useState("");
  const [sortedMessages, setSortedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const auth = useSelector((state) => state.auth);
  const contentBodyRef = useRef(null);
  const lastMessageRef = useRef(null);

  // Xử lý và sắp xếp tin nhắn khi messages thay đổi
  useEffect(() => {
    if (messages) {
      setIsLoading(true);
      // Sắp xếp tin nhắn theo thời gian
      const sorted = [...messages].sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      setSortedMessages(sorted);
      setIsLoading(false);

      // Kiểm tra tin nhắn mới và hiển thị thông báo
      if (lastMessageRef.current && sorted.length > lastMessageRef.current) {
        const latestMessage = sorted[sorted.length - 1];
        if (latestMessage.sender !== auth.email) {
          setNotification({
            open: true,
            message: `${conversation.shop.name} đã gửi một tin nhắn mới`,
            severity: "info"
          });
        }
      }
      lastMessageRef.current = sorted.length;
    }
  }, [messages, auth.email, conversation?.shop?.name]);

  const handleSend = () => {
    if (client && input.trim()) {
      const token = localStorage.getItem("token");

      const message = {
        senderEmail: auth.email,
        content: input,
        conversationId: conversation.id,
        shopId: conversation.shop.id
      };

      try {
        client.send(
          "/app/sendMessage",
          { Authorization: `Bearer ${token}` },
          JSON.stringify(message)
        );
        setInput("");
        setNotification({
          open: true,
          message: "Tin nhắn đã được gửi",
          severity: "success"
        });
      } catch (error) {
        setNotification({
          open: true,
          message: "Không thể gửi tin nhắn. Vui lòng thử lại",
          severity: "error"
        });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (contentBodyRef.current && sortedMessages.length > 0) {
      const contentBody = contentBodyRef.current;
      contentBody.scrollTop = contentBody.scrollHeight;
    }
  }, [sortedMessages]);

  if (!conversation) return null;

  return (
    <div>
      <div
        className="content-header px-3 py-2"
        style={{ borderBottom: "1px solid #dddd", width: "100%" }}
      >
        <Stack direction={"row"} sx={{ justifyContent: "start" }}>
          <Stack direction={"row"} spacing={2}>
            <Avatar
              sx={{ width: 55, height: 55 }}
              alt={conversation.shop.name}
              src={conversation.shop.avatar}
            />
            <Box>
              <div className="body-name">
                <h6
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    marginBottom: 0,
                  }}
                >
                  {conversation.shop.name}
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
        ref={contentBodyRef}
        className="content-body mt-3 px-2"
        style={{
          height: "420px",
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          sortedMessages.map((item) => (
            <MessageText
              key={item.id}
              avatar={item.sender === auth.email ? auth.avatar : conversation.shop.avatar}
              text={item.content}
              yourself={item.sender === auth.email}
            />
          ))
        )}
      </div>

      <div
        className="content-input py-4 px-4"
        style={{ borderTop: "1px solid #dddd" }}
      >
        <Form>
          <Stack direction={"row"} spacing={1}>
            <Form.Control
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              onClick={handleSend}
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              <SendIcon />
            </Button>
          </Stack>
        </Form>
      </div>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MessageContent;
