import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductList = ({ products, category, id }) => {
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const navigate = useNavigate()
  if(products.length > 0){
    return (
      <div>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "30px", marginTop: "50px" }}>
          <Container>
            <Typography variant="h5" color="initial">
              Những sản phẩm {category} bán chạy
            </Typography>
            <Stack direction={"row"} spacing={2} sx={{ justifyContent: "space-between", mt: 3 }}>
              {products.map((product) => (
                <div onClick={() => navigate("/product-detail/"+product.id)} key={product.id} className="product-item">
                  <img src={product.avatar} alt={product.name} />
                  <div className="product-info">
                    <div className="product-name-all">
                      {product.name.length > 45 ? `${product.name.substring(0, 45)}...` : product.name}
                    </div>
                    <div className="product-price">{formatCurrency(product.price)}</div>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={i < product.rating ? "star rated" : "star no-rating"}
                          />
                        ))}
                      </div>
                      <div className="rating-text no-rating-text">
                        {isNaN(product.rating) || product.rating === 0
                          ? "Sản phẩm chưa có đánh giá"
                          : `${product.rating} sao`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Stack>
            <Stack direction={"row"} justifyContent={"center"} sx={{ mt: 4 }}>
               <Button
                  onClick={() => navigate(`/category/${id}/products`)}
                  sx={{
                    background: " #ffcf20",
                    color: "#1b1b1b",
                    textTransform: "capitalize",
                    borderRadius: "100px",
                  }}
                  variant="contained"
                >
                  Xem thêm sản phẩm 
                </Button>
            </Stack>
          </Container>
        </Box>
      </div>
    );
  }
};

export default ProductList;
