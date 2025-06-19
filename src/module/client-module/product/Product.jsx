import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Link, Stack } from "@mui/material";
import ProductFilter from "./ProductFilter";
import ListProduct from "./ListProduct";
import { Container } from "react-bootstrap";
import Loading from "../loading/Loading";

const Product = ({ products }) => {
  console.log("pro",products)
  const [filterProduct, setFilterProduct] = useState(products || []);
  const [isDelayedLoading, setIsDelayedLoading] = useState(true);

  useEffect(() => {
    // Cuộn lên đầu trang khi vào trang Product
    window.scrollTo(0, 0);

    // Cập nhật filterProduct khi products thay đổi
    if (products) {
      setFilterProduct(products);
    }

    // Thiết lập trạng thái loading với timeout
    setIsDelayedLoading(true);
    const timeoutId = setTimeout(() => {
      setIsDelayedLoading(false);
    }, 300); // Thời gian delay 300ms, có thể thay đổi nếu muốn

    // Xóa timeout khi component bị unmount
    return () => clearTimeout(timeoutId);
  }, [products]);

  return (
    <div className="mt-5" id="filter-list-product">
      <Container style={{ width: "89%" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/">
            Thể loại sản phẩm
          </Link>
        </Breadcrumbs>
        <Stack
          direction={"row"}
          spacing={5}
          sx={{ justifyContent: "space-between" }}
          className="mt-5"
        >
          <Box sx={{ width: "45%" }}>
            <ProductFilter setFilterProduct={setFilterProduct} />
          </Box>
          <Box sx={{ width: "160%" }}>
            {isDelayedLoading ? (
              <Loading />
            ) : (
              <ListProduct products={filterProduct} />
            )}
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export default Product;
