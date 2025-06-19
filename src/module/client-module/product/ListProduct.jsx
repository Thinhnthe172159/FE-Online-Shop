import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./product.scss";
import { Box, Rating, Stack, Pagination } from "@mui/material";

const ListProduct = ({ products = [] }) => {
  console.log(products)
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(""); // Trạng thái để lưu tiêu chí sắp xếp
  const productsPerPage = 16;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Xử lý sắp xếp dựa trên tiêu chí
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "high-to-low") {
      return b.price - a.price;
    } else if (sortOption === "low-to-high") {
      return a.price - b.price;
    }
    return 0;
  });

  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNavigation = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Cập nhật tiêu chí sắp xếp
    setCurrentPage(1); // Reset về trang đầu khi thay đổi sắp xếp
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div>
      <Stack
        direction={"row"}
        sx={{ justifyContent: "space-between", alignItems: "start" }}
      >
        <h3 className="mb-5">Tất cả sản phẩm</h3>
        <select className="select-filter" onChange={handleSortChange}>
          <option value="">---Sắp xếp sản phẩm---</option>
          <option value="high-to-low">Xếp theo giá từ cao đến thấp</option>
          <option value="low-to-high">Xếp theo giá từ thấp đến cao</option>
        </select>
      </Stack>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="product-item">
              <div onClick={() => handleNavigation(product.id)}>
                <img
                  src={product.avatar}
                  alt={product.name}
                  className="clickable-image"
                />
              </div>
              <div className="product-info">
                <div className="product-name-all">
                  {product.name.length > 45
                    ? `${product.name.substring(0, 45)}...`
                    : product.name}
                </div>
                <div className="product-price">
                  {formatCurrency(product.price)}
                </div>
                <div className="product-rating">
                  <div className="stars">
                    <Rating
                      name="half-rating"
                      defaultValue={2.5}
                      value={product.rating}
                      readOnly
                      precision={0.5}
                    />
                  </div>
                  <div className="rating-text no-rating-text">
                    {isNaN(product.rating) || product.rating === 0
                      ? "Sản phẩm chưa có đánh giá"
                      : `${product.rating} sao`}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-product">Hiện tại chưa có sản phẩm phù hợp</div>
        )}
      </Box>

      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
          size="large"
        />
      </Stack>
    </div>
  );
};

export default ListProduct;
