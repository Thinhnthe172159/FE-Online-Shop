import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import { Container } from "react-bootstrap";
import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useQuery } from "@tanstack/react-query";
import { getProductByShop } from "../../../api/shopApi";
import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import Loading from "../../client-module/loading/Loading";

const ShopProduct = ({data}) => {
  
  const [open, setOpen] = useState({});

  const handleToggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  console.log(data);
  
 
  const getShortName = (name) => {
    if (name.length > 30) {
      let shortName = name.substring(0, 30) + "...";
      return shortName;
    }
    return name;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  let countNewProduct = 0;
  if (data) {
    countNewProduct = data.reduce((a, c) => {
      if (c.status === 0) {
        return a + 1; // Tăng giá trị a lên 1 nếu status là 0
      }
      return a; // Nếu không, trả về giá trị a hiện tại
    }, 0); // Khởi tạo giá trị của a là 0
  }

  
  

  return (
    <Box sx={{ mt: 3, mr: 5, height: "1000px" }}>
      <Stack>
        <h3>Sản phẩm của the {data[0].shop.name}</h3>
        {countNewProduct != 0 ? (
          <Typography
            variant="body1"
            sx={{
              fontSize: "12px",
              padding: "3px",
              background: "#f0a1a158",
              width: "120px",
              textAlign: "center",
              color: "red",
              fontWeight: "600",
              borderRadius: "10px",
            }}
            color="initial"
          >
            {countNewProduct} sản phẩm mới
          </Typography>
        ) : (
          ""
        )}
      </Stack>
      <TableContainer sx={{ mt: 3 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((product) => {
              let productStatus = "";
              if (product.status == 0) {
                productStatus = "Sản phẩm mới";
              } else if (product.status == 1) {
                productStatus = "Đã duyệt";
              } else {
                productStatus = "Từ chối";
              }
              return (
                <React.Fragment key={product.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleToggle(product.id)}
                      >
                        {open[product.id] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{getShortName(product.name)}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{formatCurrency(product.create_at)}</TableCell>
                    <TableCell>{productStatus}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={4}
                    >
                      <Collapse
                        in={open[product.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <ProductDetail data={product}></ProductDetail>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShopProduct;
