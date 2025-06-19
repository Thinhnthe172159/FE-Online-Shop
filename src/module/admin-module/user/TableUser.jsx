import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Pagination, Stack } from "@mui/material";
import { getAllShopOwner, updateStatus } from "../../../api/ShopOwnerApi";
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from "../../client-module/loading/Loading";
import ModalEmail from "../shop-resgiter/ModalEmail";
import Swal from 'sweetalert2';

const TableUser = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const { data: shopOwner, isLoading, refetch } = useQuery({
    queryKey: ['shopOwner'],
    queryFn: getAllShopOwner,
  })

  // Tính toán dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    if (!shopOwner) return [];
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return shopOwner.slice(startIndex, endIndex);
  };

  // Tính tổng số trang
  const totalPages = shopOwner ? Math.ceil(shopOwner.length / PAGE_SIZE) : 0;

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const [show,setShow] = useState(false)
  const [email,setMail] = useState(null)
  const handleMail = (email) =>{
      setMail(email)
      setShow(true)
  }

  const handleClose = () =>{
    setShow(false)
  }

  const { mutate } = useMutation({
    mutationFn: (data) => updateStatus(data),
    onSuccess: () => {
      refetch()
      Swal.fire({
          icon: "success",
          title: "Cập nhật tài khoản thành công",
          confirmButtonText: "Trở lại",
          confirmButtonColor: "#28a745",
      });
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const handleChangeStatus = (id, newStatus) => {
    console.log(id, newStatus);

    if (newStatus === "1") {
      alert("Đã kích hoạt tài khoản")
    } else if (newStatus === "2") {
      alert("Đã vô hiệu hóa tài khoản")
    }
    mutate({ id: id, status: newStatus });
  };

  if (isLoading) {
    return <Loading></Loading>
  } else {
    return (
      <div style={{ marginRight: "20px" }} className="mt-4">
        <ModalEmail email={email} show={show} handleClose={handleClose} subject={"Thông tin tài khoản bán hàng"}></ModalEmail>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell >No</TableCell>
                <TableCell >Email</TableCell>
                <TableCell >ngày tạo</TableCell>
                <TableCell >ngày chỉnh sửa</TableCell>
                <TableCell >hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCurrentPageData().map((s, index) => (
                <TableRow
                  key={s.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell >{s.email}</TableCell>
                  <TableCell >{s.create_at}</TableCell>
                  <TableCell >{s.update_at}</TableCell>
                  <TableCell >
                    <Stack spacing={1} direction={"row"}>
                      {s.status === 0 ? (
                        <Button variant="contained" color="success" onClick={() => handleChangeStatus(s.id, 1)}>
                          Kích hoạt
                        </Button>
                      ) : s.status === 1 ? (
                        <Button variant="contained" color="error" onClick={() => handleChangeStatus(s.id, 2)}>
                          Chặn
                        </Button>
                      ) : s.status === 2 ? (
                        <Button variant="contained" color="primary" onClick={() => handleChangeStatus(s.id, 1)}>Bỏ chặn</Button>
                      ) : null}
                      <Button variant="contained" color="warning" onClick={() =>handleMail(s.email)}>Gửi mail</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="mt-4 d-flex justify-content-center">
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </div>
      </div>
    );
  }
};

export default TableUser;
