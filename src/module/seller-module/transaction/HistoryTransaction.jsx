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
  Pagination,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { savePayForAdmin } from "../../../api/transactionApi";

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);
  console.log("row",row)
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handlePay = () => {
    let data = {
      id: row.id,
      shop: row.shop,
      order: row.order,
      amount: row.netAmount,
    };
    mutate(data);
  };

  const { mutate } = useMutation({
    mutationFn: (data) => savePayForAdmin(data),
    onSuccess: (data) => {
      window.location.href = data.data;
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: "Vui lòng thử lại sau",
      });
    },
  });

  const handleConfirm = (amount) => {
    Swal.fire({
      icon: "question",
      title: "Xác nhận thanh toán",
      text: `Bạn muốn thanh toán với cửa hàng với số tiền ${amount}, Giao dịch sẽ được lưu lại để theo dõi`,
      showConfirmButton: true,
      confirmButtonText: "Đã hoàn thành",
      showDenyButton: true,
      denyButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handlePay();
      }
    });
  };

  let styleOrder = {};

  switch (row.order.order_status) {
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
  }
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
        <TableCell sx={{ color: row.type === 1 ? "green" : "red" }}>
          {row.type === 1 ? "+" : "-"} {formatCurrency(row.amount)}
        </TableCell>
        <TableCell>{row.create_at}</TableCell>
        <TableCell
          sx={{
            color: row.isCommisson === 0 ? "red" : "green",
            fontWeight: "600",
          }}
        >
          {row.type === 1 && row.isCommisson !== 2
            ? row.isCommisson === 0
              ? "Chưa thanh toán chiết khấu"
              : "Đã thanh toán chiết khấu"
            : ""}
        </TableCell>
        <TableCell>{row.description}</TableCell>
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
              <Container style={{ width: "80%" }}>
                <Typography variant="h6" gutterBottom component="div">
                  Chi tiết giao dịch
                </Typography>
                <Table size="small" aria-label="transaction-details">
                  <TableBody>
                    <TableRow>
                      {row.type === 1 && (
                        <>
                          <TableCell component="th" scope="row">
                            Khách hàng thanh toán:
                          </TableCell>
                          <TableCell>{row.customer.email}</TableCell>
                        </>
                      )}
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row">
                        Đơn hàng :
                      </TableCell>
                      <TableCell>{row.order.code}</TableCell>
                    </TableRow>
                    {row.isCommisson !== 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {row.type === 1
                            ? "Ngày khách hàng thanh toán :"
                            : "Ngày cửa hàng thanh toán"}
                        </TableCell>
                        <TableCell>{row.create_at}</TableCell>
                      </TableRow>
                    )}

                    {row.isCommisson === 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Ngày quản trị thanh toán:
                        </TableCell>
                        <TableCell>{row.create_at}</TableCell>
                      </TableRow>
                    )}
                    {row.isCommisson !== 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền trong hóa đơn
                        </TableCell>
                        <TableCell>
                          {formatCurrency(row.order.orderTotal)}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.isCommisson !== 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền vận chuyển
                        </TableCell>
                        <TableCell>
                          {formatCurrency(row.order.shipCost)}
                        </TableCell>
                      </TableRow>
                    )}

                    {row.isCommisson === 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền quản trị đã thu hộ:
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            row.order.orderTotal + row.order.shipCost
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    {row.isCommisson === 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền chiết khấu
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            row.order.orderTotal +
                              row.order.shipCost -
                              row.amount
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.type === 1 && row.isCommisson !== 2 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền chiết khấu (Không tính phí vận chuyển):
                        </TableCell>
                        <TableCell>{formatCurrency(row.netAmount)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {row.type === 1
                          ? "Số tiền cửa hàng nhận được:"
                          : "Số tiền cửa hàng đã thanh toán chiết khấu"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "500" }}>
                        {formatCurrency(row.amount)}
                      </TableCell>
                    </TableRow>
                    {row.type === 1 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Thanh toán chiết khấu đơn hàng:
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "500",
                            color: row.isCommisson === 0 ? "red" : "green",
                          }}
                        >
                          {row.isCommisson === 0
                            ? "Chưa thanh toán"
                            : "Đã thanh toán"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                  {row.type === 1 && row.isCommisson === 0 && (
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "end", mt: 3 }}
                    >
                      <Button
                        onClick={() =>
                          handleConfirm(formatCurrency(row.amount - row.netAmount))
                        }
                        sx={{ textTransform: "initial" }}
                        variant="contained"
                      >
                        Xác nhận đã thanh toán
                      </Button>
                    </Stack>
                  )}
                </Table>
              </Container>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const HistoryTransaction = ({ data }) => {
  const [page, setPage] = useState(1); // Bắt đầu từ trang 1
  const rowsPerPage = 6; // 6 hàng trên mỗi trang

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <h4 className="my-3">Lịch sử giao dịch</h4>
      <TableContainer sx={{ mt: 3 }} component={Paper}>
        <Table aria-label="shop transaction table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Tổng hóa đơn</TableCell>
              <TableCell>Số tiền đã nhận</TableCell>
              <TableCell>Ngày nhận tiền</TableCell>
              <TableCell sx={{ width: "30%" }}>Lời nhắn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice((page - 1) * rowsPerPage, page * rowsPerPage) // Hiển thị dữ liệu theo trang
              .map((row) => (
                <Row key={row.transactionId} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ p: 4 }}
        count={Math.ceil(data.length / rowsPerPage)} // Tổng số trang
        page={page}
        color="primary"
        onChange={handleChangePage}
      />
    </Box>
  );
};

export default HistoryTransaction;
