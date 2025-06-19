import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem, InputLabel, FormControl, Pagination, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorIcon from '@mui/icons-material/Error';
import { Rating } from "@mui/material";

const ListProductSearch = ({ products, searchTerm }) => {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const productsPerPage = 16;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    const startIndex = (page - 1) * productsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);
    const sortedProducts = [...paginatedProducts].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
    setDisplayedProducts(sortedProducts);
  }, [products, page, sortOrder]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const navigate = useNavigate();

  const calculateTotalQuantity = (options) => {
    if (!options || !Array.isArray(options)) return 0;
    return options.reduce((total, option) => total + (option.quantity || 0), 0);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>


      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        {displayedProducts.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <ErrorIcon sx={{ fontSize: "50px", color: "#ff0000" }} />
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Không có sản phẩm phù hợp
            </Typography>
          </Box>
        ) : (
          displayedProducts.map((product) => (
            <div
              onClick={() => navigate("/product-detail/" + product.id)}
              key={product.id}
              className="product-item"
              style={{ cursor: "pointer" }}
            >
              <img src={product.avatar} alt={product.name} style={{ width: "100%", height: "auto" }} />
              <div className="product-info">
                <div className="product-name-all">
                  {product.name.length > 45 ? `${product.name.substring(0, 45)}...` : product.name}
                </div>
                <div className="product-price">{formatCurrency(product.price)}</div>
                <div className="product-quantity">
                  Số lượng có sẵn: {calculateTotalQuantity(product.options)}
                </div>
              </div>
            </div>
          ))
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ListProductSearch;