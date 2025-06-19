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
import ModalTransaction from "./ModalTransaction";

const Row = ({ row }) => {
  console.log(row);

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [orderCode, setOrderCode] = useState(null);
  const [amountTotal, setAmountTotal] = useState(null);
  const [finallAmount, setFinallAmount] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [tid, setTid] = useState(null);

  const handleClose = () => {
    setOrderCode(null);
    setAmountTotal(null);
    setFinallAmount(null);
    setShopId(null);
    setTid(null);
    setShow(false);
  };
  const handleOpen = (code, price, fprice, id, tid) => {
    setOrderCode(code);
    setAmountTotal(price);
    setFinallAmount(fprice);
    setShopId(id);
    setTid(tid);

    setShow(true);
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const { mutate } = useMutation({
    mutationFn: (data) => AddTransaction(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        text: "Giao dịch đã được lưu lại",
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: "Vui lòng thử lại sau",
      });
    },
  });

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
    case 4:
      styleOrder["text"] = "Đã hủy";
      styleOrder["color"] = "black";
      break;
  }
  return (
    <>
      <ModalTransaction
        show={show}
        handleClose={handleClose}
        orderCode={orderCode}
        amountTotal={amountTotal}
        fprice={finallAmount}
        shopId={shopId}
        tid={tid}
      ></ModalTransaction>
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
        <TableCell sx={{ color: row.type == 1 ? "green" : "red" }}>
          {row.type == 1 ? "+" : "-"}{" "}
          {formatCurrency(row.amount + row.shipCost - row.discount)}
        </TableCell>
        <TableCell>{row.create_at}</TableCell>
        {row.isPaid != 4 && (
          <TableCell sx={{ color: styleOrder.color, fontWeight: "600" }}>
            {row.customer.id != 0 ? styleOrder.text : ""}
          </TableCell>
        )}

        {row.isPaid == 4 && (
          <TableCell sx={{ color: "black", fontWeight: "600" }}>
            Đã hủy
          </TableCell>
        )}
        <TableCell
          sx={{ color: row.isPaid == 0 ? "red" : "green", fontWeight: "600" }}
        >
          {row.order.order_status !== 4
            ? row.type === 1 && row.isPaid !== 2
              ? row.isPaid === 0
                ? "Chưa thanh toán"
                : "Đã thanh toán"
              : ""
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
              <Container style={{ width: "70%" }}>
                <Typography variant="h6" gutterBottom component="div">
                  Chi tiết giao dịch
                </Typography>
                <Table size="small" aria-label="transaction-details">
                  {row.isPaid != 4 && (
                    <TableBody>
                      {row.customer.id != 0 && (
                        <TableRow>
                          <TableCell sx={{ mb: 3 }} component="th" scope="row">
                            Khách hàng thanh toán:
                          </TableCell>
                          <TableCell>{row.customer.email}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Cửa hàng :
                        </TableCell>
                        <TableCell>{row.shop.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Đơn hàng :
                        </TableCell>
                        <TableCell>{row.order.code}</TableCell>
                      </TableRow>
                      {row.isPaid != 2 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {row.customer.id != 0
                              ? "Ngày khách thanh toán :"
                              : "Ngày quản trị thanh toán :"}
                          </TableCell>
                          <TableCell>{row.create_at}</TableCell>
                        </TableRow>
                      )}
                      {row.isPaid == 2 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Ngày cửa hàng thanh toán
                          </TableCell>
                          <TableCell>{row.create_at}</TableCell>
                        </TableRow>
                      )}
                      {row.isPaid != 2 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {row.customer.id != 0
                              ? " Số tiền khách thanh toán :"
                              : "Số tiền quản trị đã thanh toán : "}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(ow.amount + row.shipCost - row.discount)}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.isPaid == 2 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Số tiền cửa hàng đã than toán
                          </TableCell>
                          <TableCell>
                            {formatCurrency(ow.amount + row.shipCost - row.discount)}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.customer.id != 0 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Số tiền của đơn hàng (Không tính vận chuyển)
                          </TableCell>
                          <TableCell>{formatCurrency(row.amount)}</TableCell>
                        </TableRow>
                      )}
                      {row.customer.id != 0 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Số tiền chiết khấu (Không tính phí vận chuyển):
                          </TableCell>
                          <TableCell>{formatCurrency(row.netAmount)}</TableCell>
                        </TableRow>
                      )}
                      {row.customer.id != 0 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Số tiền còn lại cần trả cho cửa hàng:
                          </TableCell>
                          <TableCell sx={{ fontWeight: "500" }}>
                            {formatCurrency(
                              row.amount + row.shipCost - row.netAmount
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.customer.id != 0 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Trạng thái thanh toán cho cửa hàng
                          </TableCell>
                          <TableCell
                            sx={{
                              color: row.payOwner == 1 ? "green" : "red",
                              fontWeight: "500",
                            }}
                          >
                            {row.isPaid == 1
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  )}

                  {row.isPaid == 4 && (
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Cửa hàng :
                        </TableCell>
                        <TableCell>{row.shop.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Đơn hàng :
                        </TableCell>
                        <TableCell>{row.order.code}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          Ngày quản trị hoàn tiền
                        </TableCell>
                        <TableCell>{row.create_at}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền khách hàng thanh toán đơn
                        </TableCell>
                        <TableCell>
                          {formatCurrency(row.order.orderTotal)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          Số tiền đã hoàn lại cho khách hành
                        </TableCell>
                        <TableCell sx={{ fontWeight: "500" }}>
                          {formatCurrency(row.amount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}

                  {(row.isPaid == 0 && row.type == 1) ||
                    (row.isPaid != 4 && (
                      <Stack
                        direction={"row"}
                        sx={{ justifyContent: "end", mt: 3 }}
                      >
                        <Button
                          onClick={() =>
                            handleOpen(
                              row.order.code,
                              formatCurrency(
                                row.amount + row.shipCost - row.netAmount
                              ),
                              row.amount + row.shipCost - row.netAmount,
                              row.shop.id,
                              row.id
                            )
                          }
                          sx={{ textTransform: "initial" }}
                          variant="contained"
                        >
                          Xác nhận đã thanh toán
                        </Button>
                      </Stack>
                    ))}
                </Table>
              </Container>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ShopTransaction = ({ data }) => {
  console.log(data);

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

  return (
    <Box>
      <h4 className="my-3">Lịch sử giao dịch</h4>
      <TableContainer sx={{ mt: 3 }} component={Paper}>
        <Table aria-label="shop transaction table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Lịch sử giao dịch</TableCell>
              <TableCell>Ngày nhận tiền</TableCell>
              <TableCell>Trạng thái đơn hàng</TableCell>
              <TableCell>Thanh toán cho cửa hàng</TableCell>
              <TableCell>Nội dung</TableCell>
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

export default ShopTransaction;
