import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Container } from "react-bootstrap";
import { fetch } from '../../../api/Fetch';
import { useNavigate, useSearchParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

const ShopSearch = () => {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key") || "";
  const [shops, setShops] = useState([]);

  // Fetch data for both products and shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch.get(`/product/search?name=${key}`);
        const data = response.data;
        
        // Filter and map the data to include only shops
        const filteredShops = data.data.filter((item) => item.type === "shop").map((shop) => ({
          ...shop,
          description: shop.description || "Không có mô tả",
          avatar: shop.avatar || "path_to_default_image",  // Fallback for missing image
          joinDate: shop.joinDate || "Không xác định",  // Fallback for missing join date
        }));

        setShops(filteredShops);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, [key]);

  const navigate = useNavigate()

  console.log(shops);
  

  return (
    <Container style={{ width: "80%" }}>
      <h4 className="my-5">Tìm kiếm cửa hàng</h4>
      {shops.length === 0 ? (
        <Typography variant="h6">Không có cửa hàng phù hợp</Typography>
      ) : (
        shops.map((shop) => (
          <Box key={shop.id}  sx={{ width: "100%", border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
            <Stack direction={"row"} sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ cursor: "pointer" }}>
                <Stack direction={"row"} spacing={2}>
                  <img
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                    src={shop.logo}
                    alt={shop.name}
                  />
                  <Box>
                    <Typography variant="body1" sx={{ fontSize: "19px", fontWeight: "700" }} color="initial">
                      {shop.name}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#868686", fontWeight: "500" }} variant="body1">
                      Tham gia 6MEMs từ: {shop.joinDate}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
{/* 
              <Box>
                <Stack direction={"column"} sx={{ alignItems: "center" }}>
                  <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
                    <StarIcon sx={{ color: "orange" }} />
                    <Typography sx={{ fontSize: "19px", fontWeight: "700" }} variant="body1" color="initial">
                      4.9
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "12px", color: "#868686", fontWeight: "500" }} variant="body1">
                    Đánh giá
                  </Typography>
                </Stack>
              </Box> */}

              <Box>
                <Button
                  type="button"
                  onClick={() => navigate("/shop/"+shop.id)}
                  sx={{
                    background: " #ffcf20",
                    color: "#1b1b1b",
                    textTransform: "capitalize",
                    borderRadius: "100px",
                  }}
                  variant="contained"
                >
                  Xem shop
                </Button>
              </Box>
            </Stack>
          </Box>
        ))
      )}
    </Container>
  );
};

export default ShopSearch;
