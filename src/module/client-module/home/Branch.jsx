import React from "react";
import { Box, Typography, Button, Stack, Container } from "@mui/material";

const BrandShowcase = () => {
  return (
    <Container sx={{ marginTop: "50px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        THƯƠNG HIỆU CHẤT
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          backgroundColor: "#eaf4f2",
          padding: "30px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        {/* Left images */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <img
            src="https://static.chus.vn/images/thumbnails/1264/641/banner_brand/182/Muo%CC%82%CC%81i_1263X711_Artisan.jpg"
            alt="Artisan Work 1"
            style={{ width: "200px", borderRadius: "8px" }}
          />
          <img
            src="https://static.chus.vn/images/thumbnails/1264/641/banner_brand/182/Muo%CC%82%CC%81i_1263X711_Artisan.jpg"
            alt="Artisan Work 2"
            style={{ width: "200px", borderRadius: "8px" }}
          />
        </Box>

        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#e6f2f8",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            <img
              src="https://static.chus.vn/images/thumbnails/1264/641/banner_brand/182/Muo%CC%82%CC%81i_1263X711_Artisan.jpg"
              alt="Founder"
              style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #ccc" }}
            />
            <Box>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>NGUYỄN KHÁNH HÀ</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ backgroundColor: "#d7a86e", padding: "2px 8px", borderRadius: "15px", display: "inline-block", fontWeight: "bold", color: "#fff" }}>
                Founder MUỐI CONCEPT
              </Typography>
            </Box>
          </Stack>
          <Typography variant="h5" mt={2} mb={1} style={{ fontWeight: "bold" }}>
            NƠI TÌNH YÊU VÀ THIÊN NHIÊN GIAO HÒA
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            WHERE NATURE'S BEAUTY MEETS ART
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Mang sắc hoa vào không gian sống. Tranh ép hoa khô của Muối Concepts, không chỉ là vật trang trí, mà còn là những tác phẩm nghệ thuật mang đậm dấu ấn cá nhân.
          </Typography>
          <Typography variant="body2" color="textSecondary" fontStyle="italic">
            Add a floral touch to your living space. Muối Concepts' pressed flower art isn't just decoration; it's a personalized piece of art.
          </Typography>
          <Button variant="contained" color="warning" sx={{ mt: 3, px: 3, backgroundColor: "#fcb900", color: "#fff", fontWeight: "bold" }}>
            Khám phá thêm
          </Button>
        </Box>

        {/* Right images */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <img
            src="https://static.chus.vn/images/thumbnails/1264/641/banner_brand/182/Muo%CC%82%CC%81i_1263X711_Artisan.jpg"
            alt="Artisan Work 3"
            style={{ width: "200px", borderRadius: "8px" }}
          />
          <img
            src="https://static.chus.vn/images/thumbnails/1264/641/banner_brand/182/Muo%CC%82%CC%81i_1263X711_Artisan.jpg"
            alt="Artisan Work 4"
            style={{ width: "200px", borderRadius: "8px" }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default BrandShowcase;
