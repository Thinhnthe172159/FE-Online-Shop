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
  Paper,
} from "@mui/material";

import SellerTableRow from "./SellerTableRow";
import { useNavigate } from "react-router-dom";



const SellerOrderTable = ({data, refetch}) => {
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Email người đặt</TableCell>
            <TableCell>Tổng đơn</TableCell>
            <TableCell>Ngày đặt</TableCell>
            <TableCell>Trạng thái thanh toán</TableCell>
            <TableCell>Trạng thái đơn hàng</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <SellerTableRow refetch={refetch} key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SellerOrderTable;
