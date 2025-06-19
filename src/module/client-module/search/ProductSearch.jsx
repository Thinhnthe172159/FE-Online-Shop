import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import ProductFilterSearch from "./ProductFilterSearch";
import ListProductSearch from "./ListProductSearch";

const ProductSearch = ({ searchTerm }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  return (
    <Container sx={{ display: "flex", gap: "30px", padding: "20px" }}>
      <Box sx={{ width: "25%", minWidth: "200px" }}>
        <ProductFilterSearch setFilterProduct={setFilteredProducts} searchTerm={searchTerm} />
      </Box>
      <Box sx={{ width: "75%" }}>
        <ListProductSearch products={filteredProducts} searchTerm={searchTerm} />
      </Box>
    </Container>
  );
};

export default ProductSearch;