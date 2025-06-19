import React, { useEffect, useState } from "react"; // Thêm useEffect vào import
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Pagination, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from "../../client-module/loading/Loading";
import { getAllCustomers, updateCustomerManage, updateStatus } from "../../../api/customerApi";
import { Form } from "react-bootstrap";
import ModalEmail from "../shop-resgiter/ModalEmail";
import Swal from 'sweetalert2';

const TableCustomer = () => {
    const [show,setShow] = useState(false)
    const [email,setMail] = useState(null)
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 8;
    
    const handleMail = (email) =>{
        setMail(email)
        setShow(true)
    }
    const [isOpen, setIsOpen] = useState(false);
    const [cusEdit, setCusEdit] = useState(null);
    const toggleForm = (customers) => {
        setIsOpen(!isOpen);
        if (customers) {
            setCusEdit({
                ...customers,
                password: generatePassword()
            });
            setErr(null); // Reset error when opening form
        } else {
            setCusEdit(null);
            setErr(null); // Reset error when closing form
        }
    }

    const handleClose =() =>{
        setShow(false)
    }

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = '';
        password += chars.charAt(Math.floor(Math.random() * 26 + 26)); // 1 uppercase
        password += chars.charAt(Math.floor(Math.random() * 26)); // 1 lowercase
        password += chars.charAt(Math.floor(Math.random() * 10 + 52)); // 1 number
        password += chars.charAt(Math.floor(Math.random() * 10 + 62)); // 1 special character
        for (let i = 4; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length)); // 2 random
        }
        return password.split('').sort(() => 0.5 - Math.random()).join(''); // shuffle
    };

    const { data: customers, isLoading, refetch } = useQuery({
        queryKey: ['customers'],
        queryFn: getAllCustomers,
    })

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Tính toán dữ liệu cho trang hiện tại
    const getCurrentPageData = () => {
        if (!customers) return [];
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return customers.slice(startIndex, endIndex);
    };

    // Tính tổng số trang
    const totalPages = customers ? Math.ceil(customers.length / PAGE_SIZE) : 0;

    const [err, setErr] = useState(null);

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
            console.log(error)
        }
    })

    const queryClient = useQueryClient(); // Khởi tạo queryClient

    const { mutate: updateMutate } = useMutation({
        mutationFn: (data) => updateCustomerManage(data),
        onSuccess: () => {
            queryClient.refetchQueries(["customers"]);
            setIsOpen(false);
            Swal.fire({
                icon: "success",
                title: "Cập nhật thông tin thành công",
                text: "Thông tin khách hàng đã được cập nhật",
                confirmButtonText: "Đóng",
                confirmButtonColor: "#28a745",
            });
            setErr(null);
        },
        onError: (err) => {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Lỗi cập nhật",
                text: err.response?.data?.message || "Không thể cập nhật thông tin khách hàng",
                confirmButtonText: "Thử lại",
                confirmButtonColor: "#dc3545",
            });
            setErr(err.response?.data?.message);
        }
    });

    const onsubmit = (e) => {
        e.preventDefault();
        if (!cusEdit.email) {
            setErr("Vui lòng nhập email");
            return;
        } else if (!cusEdit.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
            setErr("Email không hợp lệ");
            return;
        } else if (!cusEdit.name) {
            setErr("Vui lòng nhập tên người dùng");
            return;
        } else {
            setErr(null);
            updateMutate(cusEdit);
        }
    };

    const handleChangeStatus = (id, newStatus) => {
        console.log(id, newStatus);

        mutate({ id: id, status: newStatus })

    };
    const handleChange = (e) => {
        setCusEdit({ ...cusEdit, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <Loading></Loading>
    } else {
        return (
            <div style={{ marginRight: "20px" }} className="mt-4">
                <ModalEmail handleClose={handleClose} show={show} email={email} subject={"Thông tin tài khoản"}></ModalEmail>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >No</TableCell>
                                <TableCell >Email</TableCell>
                                <TableCell >Tên</TableCell>
                                <TableCell >Ngày tạo</TableCell>
                                <TableCell >Ngày chỉnh sửa</TableCell>
                                <TableCell >hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                getCurrentPageData().map((c, index) =>
                                (
                                    <TableRow
                                        key={c.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {(page - 1) * PAGE_SIZE + index + 1}
                                        </TableCell>
                                        <TableCell >{c.email}</TableCell>
                                        <TableCell >{c.name}</TableCell>
                                        <TableCell >{c.create_at}</TableCell>
                                        <TableCell >{c.update_at}</TableCell>
                                        <TableCell >
                                            <Stack spacing={1} direction={"row"}>
                                                <div>
                                                    <Button variant="contained" color="success" onClick={() => toggleForm(c)}>chỉnh sửa</Button>
                                                    <Dialog open={isOpen} onClose={() => toggleForm(null)} fullWidth maxWidth="sm">
                                                        <DialogTitle>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                Chỉnh sửa thông tin khách hàng
                                                                <Button onClick={() => toggleForm(null)} color="inherit" size="small">
                                                                    ✕
                                                                </Button>
                                                            </Stack>
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <Form onSubmit={onsubmit}>
                                                                {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
                                                                <TextField 
                                                                    onChange={handleChange} 
                                                                    value={cusEdit?.email || ''} 
                                                                    name='email' 
                                                                    margin="dense" 
                                                                    label="Email" 
                                                                    type="email" 
                                                                    fullWidth 
                                                                    required
                                                                    error={!!err && err.includes('email')}
                                                                />
                                                                <TextField 
                                                                    onChange={handleChange} 
                                                                    value={cusEdit?.name || ''} 
                                                                    name='name' 
                                                                    margin="dense" 
                                                                    label="Tên người dùng" 
                                                                    type="text" 
                                                                    fullWidth 
                                                                    required
                                                                    error={!!err && err.includes('tên')}
                                                                />
                                                                <TextField 
                                                                    value={cusEdit?.password || ''} 
                                                                    disabled 
                                                                    margin="dense" 
                                                                    label="Mật khẩu" 
                                                                    type="password" 
                                                                    fullWidth 
                                                                />
                                                                <DialogActions>
                                                                    <Button onClick={() => toggleForm(null)} color="error">
                                                                        Hủy
                                                                    </Button>
                                                                    <Button type='submit' variant="contained" color="primary">
                                                                        Cập nhật
                                                                    </Button>
                                                                </DialogActions>
                                                            </Form>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                                
                                                {c.status === 0 ? (
                                                    <Button variant="contained" color="success" onClick={() => handleChangeStatus(c.id, 1)}>
                                                        Kích hoạt
                                                    </Button>
                                                ) : c.status === 1 ? ( // Thêm điều kiện cho status 1
                                                    <Button variant="contained" color="error" onClick={() => handleChangeStatus(c.id, 2)}>
                                                        Chặn
                                                    </Button>
                                                ) : c.status === 2 ? ( // Sửa lỗi cú pháp ở đây
                                                    <Button variant="contained" color="primary" onClick={() => handleChangeStatus(c.id, 1)}>Bỏ chặn</Button>
                                                ) : null}
                                                <Button variant="contained" color="warning" onClick={() => handleMail(c.email)}>
                                                        Gửi mail
                                                    </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                                )
                            }
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
        )
    }
}

export default TableCustomer
