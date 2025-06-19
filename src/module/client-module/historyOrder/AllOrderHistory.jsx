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
  Pagination,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const AllOrderHistory = ({ data }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Paper>
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        Lịch sử đơn hàng
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Cửa hàng</TableCell>
              <TableCell>Người nhận</TableCell>
              <TableCell>Tổng đơn</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian đặt</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) // Tính số hàng hiển thị trên mỗi trang
              .map((order) => {
                let styleOrder = {};
                switch (order.order_status) {
                  case 0:
                    styleOrder["text"] = "Chưa xác nhận";
                    styleOrder["color"] = "red";
                    break;
                  case 1:
                    styleOrder["text"] = "Đã xác nhận";
                    styleOrder["color"] = "orange";
                    break;
                  case 2:
                    styleOrder["text"] = "Đang giao hàng";
                    styleOrder["color"] = "orange";
                    break;
                  case 3:
                    styleOrder["text"] = "Hoàn tất";
                    styleOrder["color"] = "green";
                    break;
                  case 4:
                    styleOrder["text"] = "Đã hủy";
                    styleOrder["color"] = "black";
                    break;
                  default:
                    styleOrder["text"] = "Không xác định";
                    styleOrder["color"] = "gray";
                }
                return (
                  <TableRow key={order.code}>
                    <TableCell>{order.code}</TableCell>
                    <TableCell>{order.shop.name}</TableCell>
                    <TableCell>{order.address.nameReceiver}</TableCell>
                    <TableCell>
                      {formatCurrency(order.orderTotal + order.shipCost-order.discount)}
                    </TableCell>
                    <TableCell
                      sx={{ color: styleOrder.color, fontWeight: 700 }}
                    >
                      {styleOrder.text}
                    </TableCell>
                    <TableCell>{order.create_at}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          navigate("/profile/order-detail/" + order.id)
                        }
                        sx={{ textTransform: "initial" }}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ p: 4 }}
        count={Math.ceil(data.length / PAGE_SIZE)} // Tổng số trang
        page={page}
        color="primary"
        onChange={handleChangePage}
      />
    </Paper>
  );
};

export default AllOrderHistory;
