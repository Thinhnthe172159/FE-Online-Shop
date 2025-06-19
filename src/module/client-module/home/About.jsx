import React from "react";
import { Box, Typography, Stack, Container } from "@mui/material";

const CHUSInfo = () => {
  const chusItems = [
    {
      title: "Duy nhất và Độc đáo",
      description:
        "CHUS là sàn thương mại điện tử đầu tiên tại Việt Nam, chuyên phân phối các sản phẩm thủ công “make in Vietnam”. Chúng tôi hướng đến việc cung cấp cho người dùng các sản phẩm chất lượng, độc đáo, và thân thiện với môi trường với những câu chuyện truyền cảm hứng ẩn sau chúng.",
      image: "https://chus.vn/images/chus/banner/Chus_WhatIsIt1.png",
      color: "#1a73e8",
    },
    {
      title: "Nâng cao giá trị của các nghệ nhân Việt",
      description:
        "CHUS kết nối và hợp tác với nhiều nghệ nhân, thợ thủ công tài năng, những cá thể luôn muốn tạo ra sự khác biệt bằng chính đôi tay của mình. Tại CHUS, mỗi sản phẩm đều biểu trưng cho nỗ lực không ngừng và tình yêu mà mỗi nghệ nhân gửi gắm trong từng chi tiết.",
      image: "https://chus.vn/images/chus/banner/Chus_WhatIsIt2.png",
      color: "#4caf50",
    },
    {
      title: "CHUS nhiều hơn nữa",
      description:
        "Sản phẩm nhập khẩu không phải lúc nào cũng là tốt nhất. Là cầu nối vững chắc giữa người tiêu dùng và các thương hiệu địa phương, 6MEMs luôn cố gắng hoàn thiện mình trên từng đoạn hành trình. Không những mang đến cho bạn trải nghiệm tuyệt vời mà còn là những sản phẩm độc đáo và chất lượng nhất.",
      image: "https://chus.vn/images/chus/banner/Chus_WhatIsIt3.png",
      color: "#e53935",
    },
  ];

  return (
    <Container sx={{ marginTop: "50px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Giới Thiệu Về 6MEMs
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Tìm câu chuyện của chúng tôi <a href="#link">ở đây</a>
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, flexWrap: "wrap" }}>
        {chusItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              maxWidth: "350px",
              padding: 3,
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            <img src={item.image} alt={item.title} style={{ width: "100%", marginBottom: "20px" }} />
            <Typography variant="h6" gutterBottom style={{ color: item.color, fontWeight: "bold" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default CHUSInfo;
