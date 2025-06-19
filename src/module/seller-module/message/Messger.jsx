import React, { useState, useEffect } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { Container } from "react-bootstrap";
import { Box, Stack } from "@mui/material";
import MessageNav from "./MessageNav";
import MessageContent from "./MessageContent";
import "./message.scss";
import { useQuery } from "@tanstack/react-query";
import { getAllConverSation, getMessages } from "../../../api/chatApi";

const MessagerShop = () => {
  const [status, setStatus] = useState(""); // Trạng thái kết nối
  const [client, setClient] = useState(null); // STOMP client
  const [conversation, setConversation] = useState(null);

  // Fetch tất cả các cuộc trò chuyện
  const { data: conversations, refetch: refetchConversations } = useQuery({
    queryKey: ["get-conversation"],
    queryFn: getAllConverSation,
  });

  // Fetch tin nhắn của cuộc trò chuyện đã chọn
  const {
    data: messages,
    refetch: refetchMessages,
    isLoading: isMessagesLoading,
  } = useQuery({
    queryKey: ["get-message", conversation?.id], // key thay đổi khi conversation.id thay đổi
    queryFn: () => getMessages(conversation.id),
  
  });

  console.log(messages);
  
  
  

  const selectConversation = (c) => {
    setConversation(c);
  };

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = over(socket);

    const onConnect = () => {
      stompClient.subscribe("/topic/messages", (message) => {
        console.log("Đã nhận tin nhắn mới");
        // Lắng nghe khi có tin nhắn mới và gọi lại refetch để cập nhật messages
        console.log(conversation);
        
        if (conversation?.id) {
            console.log("đã gọi");
            
          refetchMessages(); // Gọi lại API để lấy tin nhắn mới
        }
        refetchConversations(); // Làm mới danh sách cuộc trò chuyện
      });
    };

    const onError = (error) => {
      setStatus("Kết nối thất bại!");
      console.error("WebSocket lỗi:", error);
    };

    stompClient.connect({}, onConnect, onError);
    setClient(stompClient);

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [conversation, refetchMessages, refetchConversations]); // Điều chỉnh để đúng khi conversation thay đổi

  return (
    <div>
      <Container style={{ width: "70%" }}>
        <Box
          sx={{
            minHeight: "500px",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            mt: 4,
          }}
        >
          <Stack direction={"row"} sx={{ height: "100%" }}>
            <Box sx={{ width: "30%", minHeight: "100%" }}>
              <MessageNav
                selectConversation={selectConversation}
                conversation={conversation}
                data={conversations}
              />
            </Box>
            <Box sx={{ width: "70%", minHeight: "100%" }}>
              <MessageContent
                conversation={conversation}
                messages={messages}
                client={client}
              />
            </Box>
          </Stack>
        </Box>
      </Container>
    </div>
  );
};

export default MessagerShop;
