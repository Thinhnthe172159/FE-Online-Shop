import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { AddTransaction } from "../../../api/transactionApi";

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  console.log("row",row);
  

  
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.order.code}</TableCell>
        <TableCell>{formatCurrency(row.order.orderTotal-row.order.amount)}</TableCell>
        <TableCell>{formatCurrency(row.sipAmount)}</TableCell>
        <TableCell sx={{ color: row.status == 1 ? "green" : "red" }}>
          {row.status == 1 ? "+" : "-"} {formatCurrency(row.amount)}
        </TableCell>
        <TableCell>{row.order.create_at}</TableCell>
        <TableCell sx={{ color: row.payOwner == 0 ? "red" : "green" }}>
          {row.payOwner == 0 ? "Chưa thanh toán" : "Đã thanh toán"}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              margin={2}
              padding={2}
              border={1}
              borderColor="grey.300"
              borderRadius={1}
            >
              <Container style={{ width: "60%" }}>
                <Typography variant="h6" gutterBottom component="div">
                  Transaction Details
                </Typography>
                <Table size="small" aria-label="transaction-details">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ mb: 3 }} component="th" scope="row">
                        Thanh toán đơn hàng
                      </TableCell>
                      <TableCell>{row.order.code}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Cửa hàng :
                      </TableCell>
                      <TableCell>{row.shop.name}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">
                        Tổng tiền đơn hàng :
                      </TableCell>
                      <TableCell>{formatCurrency(row.order.orderTotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Phí vận chuyển :
                      </TableCell>
                      <TableCell>{formatCurrency(row.sipAmount)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Số tiền chiết khấu (Không tính phí vận chuyển):
                      </TableCell>
                      <TableCell>{formatCurrency(row.netAmount)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Số tiền đã thanh toán cho cửa hàng:
                      </TableCell>
                      <TableCell>{formatCurrency(row.amount)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Trạng thái thanh toán cho cửa thành
                      </TableCell>
                      <TableCell sx={{ color: "green", fontWeight: "500" }}>
                        Thành công
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Container>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ShopTransactionPay = ({ data }) => {
  // Sample data for illustration
  const rows = [
    {
      transactionId: 1,
      customerId: 101,
      shopId: 15,
      amount: 1000,
      netAmount: 950,
      commission: 3,
      status: "Completed",
      createdAt: "2024-11-05",
      updatedAt: "2024-11-05",
    },
    // Add more rows as needed
  ];

  console.log(data);
  

  return (
    <Box>
      <h4 className="my-3">Cách đơn hàng đã nhận tiền</h4>
      <TableContainer sx={{ mt: 3 }} component={Paper}>
        <Table aria-label="shop transaction table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Tổng hóa đơn</TableCell>
              <TableCell>Phí vận chuyển</TableCell>
              <TableCell>Số tiền đã thanh toán</TableCell>
              <TableCell>Ngày thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              {/* <TableCell>Thanh toán cho cửa hàng</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row key={row.transactionId} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShopTransactionPay;
