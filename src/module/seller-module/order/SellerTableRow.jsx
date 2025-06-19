import React, { useState } from "react";
import { TableCell, TableRow, IconButton, Collapse } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, South } from "@mui/icons-material";
import { TextField, Typography, Box, Stack } from "@mui/material";
import ExpanDetail from "./ExpanDetail";

const SellerTableRow = ({ row,refetch }) => {
  let styleOrder = {};
  let stylePayment = {};
  switch (row.order_status) {
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
  switch (row.payment_status) {
    case 0:
      (stylePayment["text"] = "Chưa thanh toán"),
        (stylePayment["color"] = "red");
      break;
    case 1:
      (stylePayment["text"] = "Đã thanh toán"),
        (stylePayment["color"] = "green");
      break;

    default:
      break;
  }

  const [open, setOpen] = useState(false);
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.code}</TableCell>
        <TableCell>{row.customer.email}</TableCell>
        <TableCell>{formatCurrency(row.orderTotal + row.shipCost - row.discount)}</TableCell>
        <TableCell>{row.create_at}</TableCell>
        <TableCell sx={{ color: stylePayment.color, fontWeight: "700" }}>
          {stylePayment.text}
        </TableCell>
        <TableCell sx={{ color: styleOrder.color, fontWeight: "700" }}>
          {styleOrder.text}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ExpanDetail refetch={refetch} row={row}></ExpanDetail>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SellerTableRow;
