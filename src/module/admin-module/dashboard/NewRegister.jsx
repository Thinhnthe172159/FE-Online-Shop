import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const NewRegister = ({data}) => {
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên Cửa Hàng</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Trạng Thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.customer.email}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.customer.email}</TableCell>
              <TableCell>{row.status === 0 ? "Chưa xử lý" : "Đã xử lý"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NewRegister;
