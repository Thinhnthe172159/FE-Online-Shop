import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useQuery } from "@tanstack/react-query";
import { getProductInOrderSuccess } from "../../../api/orderApi";
import { useNavigate } from "react-router-dom";

const ProductOrderSuccess = () => {
  const { data } = useQuery({
    queryKey: ["get-product-order-success"],
    queryFn: getProductInOrderSuccess,
    retry: 0,
  });

  console.log(data);
  
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getShortName = (name) => {
    return name.length > 30 ? name.substring(0, 30) + "..." : name;
  };

  // Phân trang dữ liệu để hiển thị chỉ 5 item trên mỗi trang
  const displayedData = data ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : [];

  return (
    <TableContainer component={Paper} sx={{ marginTop: 3, padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Những sản phẩm đang chờ đánh giá
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Đơn hàng</TableCell>
            <TableCell>Tên Sản Phẩm</TableCell>
            <TableCell>Ảnh sản phẩm</TableCell>
            <TableCell>Ngày mua hàng</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedData.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.order.code}</TableCell>
              <TableCell>{getShortName(product.product.name)}</TableCell>
              <TableCell><img style={{width:'100px', height:"100px" ,objectFit:'cover'}} src={product.product.avatar} alt="" /></TableCell>
              <TableCell>{product.order.create_at}</TableCell>
              <TableCell>
                <Button onClick={() => navigate("/profile/feedback/"+product.id)} sx={{textTransform:"initial"}}>Đánh giá ngay</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Giao diện phân trang */}
      <Stack spacing={2} sx={{ alignItems: 'center', marginTop: 2 }}>
        <Pagination
          count={Math.ceil((data ? data.length : 0) / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </TableContainer>
  );
};

export default ProductOrderSuccess;
