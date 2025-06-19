import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteRegist, getAllRegister, updateStatus } from "../../../api/shopRegisterApi";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loading from "../../client-module/loading/Loading";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icon cho hiệu ứng mở rộng
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // Icon cho hiệu ứng thu nhỏ
import dayjs from "dayjs";
import ModalEmail from "./ModalEmail";
import Swal from "sweetalert2";

const ShopRegisterAdmin = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["shop-register-all"],
    queryFn: getAllRegister,
  });

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(null);

  // Tính toán dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    if (!data) return [];
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  // Tính tổng số trang
  const totalPages = data ? Math.ceil(data.length / PAGE_SIZE) : 0;

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleShow = (email) => {
    setEmail(email);
    setShow(true);
  };

  const handleClose = () => {
    setEmail(null);
    setShow(false);
  };

  const {mutate} = useMutation({
      mutationFn: (data) => updateStatus(data),
      onSuccess: () => {
        refetch()
        Swal.fire({
          icon:"success",
          text:"Cập nhật thành công"
        })
      },
      onError:() =>{
        Swal.fire({
          icon:"error",
          text:"Cập nhật thất bại"
        })
      }
  })

  const {mutate:deleteRegistHandle} = useMutation({
    mutationFn: (data) => deleteRegist(data),
    onSuccess: () => {
      refetch()
      Swal.fire({
        icon:"success",
        text:"Xóa thành công"
      })
    },
    onError:() =>{
      Swal.fire({
        icon:"error",
        text:"Cập nhật thất bại"
      })
    }
})


const deleteRegister = (id) =>{
  Swal.fire({
    icon:"question",
    text:"Bạn có chắc chắn muốn xóa đơn đăng ký này",
    showConfirmButton:true,
    showCancelButton:true
  })
  .then((result) =>{
      if(result.isConfirmed){
        deleteRegistHandle(id)
      }
  })
}

  

  const updateChange = (id) =>{
      mutate(id)
  }

  const [expandedRow, setExpandedRow] = useState(null); // State để theo dõi hàng nào đang mở rộng

  if (isLoading) {
    return <Loading />;
  }

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id); // Chuyển đổi trạng thái hàng mở rộng
  };

  return (
    <div style={{ marginRight: "20px" }} className="mt-4">
      <h2 className="my-5">Danh sách đăng ký bán hàng</h2>
      <TableContainer component={Paper}>
        <ModalEmail email={email} show={show} subject={"Đăng ký bán hàng "} handleClose={handleClose}></ModalEmail>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tên người gửi</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Bán online hoặc trực tiếp</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
              <TableCell>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageData().map((row) => {
                let onlineState = "";
                if (row.isOnline === 0) {
                  onlineState = "Có cửa hàng trực tiếp";
                } else if (row.isOnline === 1) {
                  onlineState = "Chỉ bán online";
                } else {
                  onlineState = "Cả hai";
                }

                const isExpanded = expandedRow === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" scope="row">
                        {(page - 1) * PAGE_SIZE + data.indexOf(row) + 1}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.customer.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{onlineState}</TableCell>
                      <TableCell>
                        {dayjs(row.create_at).format("DD-MM-YYYY h:mm A")}
                      </TableCell>
                      <TableCell>
                        <b>{row.status === 0 ? "Chưa xử lý" : "Đã xử lý"}</b>
                      </TableCell>
                      <TableCell>
                        <Stack direction={"row"} spacing={2}>
                          <Button onClick={() => deleteRegister(row.id)} variant="contained" color="error">
                            <DeleteIcon />
                          </Button>
                          <Button onClick={() => handleShow(row.customer.email)} variant="contained" color="warning">
                            <EmailIcon />
                          </Button>
                          {row.status == 0 && <Button onClick={() => updateChange(row.id)} sx={{textTransform:"initial"}} variant="contained" color="success">
                            Đã duyệt
                          </Button>}
                        </Stack>
                      </TableCell>
                      {/* Icon để cho thấy trạng thái mở rộng */}
                      <TableCell onClick={() => handleRowClick(row.id)}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </TableCell>
                    </TableRow>
                    {/* Hàng mở rộng */}
                    <TableRow
                      style={{
                        height: isExpanded ? "auto" : "0",
                        overflow: "hidden",
                        transition: "height 0.3s ease",
                      }}
                    >
                      <TableCell
                        colSpan={8}
                        style={{
                          padding: isExpanded ? "16px" : "0",
                          transition: "padding 0.3s ease",
                        }}
                      >
                        {isExpanded && (
                          <div
                            style={{
                              padding: "10px",
                            }}
                          >
                            <Stack>
                              <Box className="my-2">
                                <Stack>
                                  <Typography fontWeight={700} className="mb-3">
                                    Mã só thuế :
                                  </Typography>
                                  <TextField
                                    name="desc"
                                    sx={{ width: "80%", marginLeft: "20px" }}
                                    variant="standard"
                                    value={row.taxNumber}
                                  />
                                </Stack>
                              </Box>
                              <Box className="my-5">
                                <Stack>
                                  <Typography fontWeight={700} className="mb-3">
                                    Mô tả cửa hàng :{" "}
                                  </Typography>
                                  <TextField
                                    name="desc"
                                    multiline
                                    minRows={4} // Chiều cao tối thiểu
                                    maxRows={6} // Chiều cao tối đa
                                    sx={{ width: "80%", marginLeft: "20px" }}
                                    variant="standard"
                                    value={row.desc}
                                  />
                                </Stack>
                              </Box>
                              <Box className="my-3">
                                <Stack>
                                  <Typography fontWeight={700} className="mb-3">
                                    Các hình ảnh được cung cấp :{" "}
                                  </Typography>
                                  <Stack
                                    sx={{ flexWrap: "wrap" }}
                                    direction={"row"}
                                    spacing={2}
                                  >
                                    {row.images.map((item) => {
                                      return (
                                        <img
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                          src={item.image}
                                          alt=""
                                        />
                                      );
                                    })}
                                  </Stack>
                                </Stack>
                              </Box>
                            </Stack>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
            })}
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
};

export default ShopRegisterAdmin;
