import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Pagination, Stack } from '@mui/material';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../main';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loading from '../../client-module/loading/Loading';
import { getAllAdmin, updateStatus, deleteAdmin, updateAdmin } from '../../../api/AdminApi';
import Swal from 'sweetalert2';
import axios from 'axios';
const TableAdmin = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [adminEdit, setAdminEdit] = useState(
        {
            email: "",
            name: "",
            password: "",
            phone: "",
            address: "",
            district: "",
            ward: "",
            province: ""
        }
    );

    const [err, setErr] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectProvince, setSelectProvince] = useState("");
    const [selectDistrict, setSelectDistrict] = useState("");
    const [selectWard, setSelectWard] = useState("");

    useEffect(() => {
        axios
            .get("https://esgoo.net/api-tinhthanh/1/0.htm")
            .then((data) => setProvinces(data.data.data));
    }, []);

    useEffect(() => {
        if (selectProvince) {
            axios
                .get(`https://esgoo.net/api-tinhthanh/2/${selectProvince.id}.htm`)
                .then((data) => setDistricts(data.data.data));
        } else {
            setDistricts([]);
            setSelectDistrict("");
            setSelectWard("");
        }
    }, [selectProvince]);

    useEffect(() => {
        if (selectDistrict) {
            axios
                .get(`https://esgoo.net/api-tinhthanh/3/${selectDistrict.id}.htm`)
                .then((data) => setWards(data.data.data));
        } else {
            setWards([]);
            setSelectWard("");
        }
    }, [selectDistrict]);

    const handleSelectProvince = (e) => {
        const value = JSON.parse(e.target.value);
        setSelectProvince(value);
        setSelectDistrict(""); // Reset district
        setSelectWard(""); // Reset ward
        setAdminEdit({ ...adminEdit, province: value.name, district: "", ward: "" }); // Set province name in adminEdit state
        setErr(null);
    };

    const handleSelectDistrict = (e) => {
        const value = JSON.parse(e.target.value);
        setSelectDistrict(value);
        setSelectWard("");
        setAdminEdit({ ...adminEdit, district: value.name, ward: "" }); // Set district name in adminEdit state
        setErr(null);
    };

    const handleSelectWard = (e) => {
        const value = JSON.parse(e.target.value);
        setSelectWard(value);
        setAdminEdit({ ...adminEdit, ward: value.name }); // Set ward name in adminEdit state
        setErr(null);
    };

    const { data: admin, isLoading, refetch } = useQuery({
        queryKey: ['admin'],
        queryFn: getAllAdmin,
    })
    console.log(admin);

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

    const { mutate: updateMutate } = useMutation({
        mutationFn: (data) => updateAdmin(data),
        onSuccess: () => {
            queryClient.refetchQueries(["admin"]);
            setIsOpen(false);
            Swal.fire({
                icon: "success",
                title: "Cập nhật tài khoản thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
        },
        onError: (err) => {
            setErr(err.response.data.message);
        }
    });

    const { mutate: deleteMutate } = useMutation({
        mutationFn: (id) => deleteAdmin(id),
        onSuccess: () => {
            refetch()
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const toggleForm = (admin) => {
        setIsOpen(!isOpen);
        setAdminEdit({
            ...admin,
            password: generatePassword(),
            province: admin.province || "",
            district: admin.district || "",
            ward: admin.ward || ""
        });
    }

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = '';
        password += chars.charAt(Math.floor(Math.random() * 26 + 26)); // 1 uppercase
        password += chars.charAt(Math.floor(Math.random() * 26)); // 1 lowercase
        password += chars.charAt(Math.floor(Math.random() * 10 + 52)); // 1 number
        password += chars.charAt(Math.floor(Math.random() * 10 + 62)); // 1 special character
        for (let i = 4; i < 6; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length)); // 2 random
        }
        return password.split('').sort(() => 0.5 - Math.random()).join(''); // shuffle
    };

    const onsubmit = (e) => {
        e.preventDefault();
        console.log(adminEdit);
        if (adminEdit.email === "") {
            setErr("vui lòng nhập email");
            return;
        } else if (!adminEdit.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
            setErr("vui lòng kiểm tra lại email");
            return;
        } else if (adminEdit.name === "") {
            setErr("vui lòng nhập tên");
            return;
        } else if (adminEdit.phone === "") {
            setErr("vui lòng nhập số điện thoại");
            return;
        } else if (adminEdit.phone.length !== 10) {
            setErr("vui lòng kiểm tra lại số điện thoại");
            return;
        } else if (adminEdit.address === "") {
            setErr("vui lòng nhập địa chỉ");
            return;
        } else if (adminEdit.district === "") {
            setErr("vui lòng nhập quận huyện");
            return;
        } else if (adminEdit.ward === "") {
            setErr("vui lòng nhập phường xã");
            return;
        } else if (adminEdit.province === "") {
            setErr("vui lòng nhập tỉnh thành phố");
            return;
        } else {
            setErr(null);
            updateMutate(adminEdit);
        }
    };

    const handleChangeStatus = (id, newStatus) => {
        console.log(id, newStatus);
        mutate({ id: id, status: newStatus });
    };

    const handleDelete = (id) => {
        console.log(id);
        deleteMutate(id);
    };

    const handleChange = (e) => {
        setAdminEdit({ ...adminEdit, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <Loading />
    } else {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >No</TableCell>
                                <TableCell >Email</TableCell>
                                <TableCell >tên</TableCell>
                                <TableCell >ngày tạo</TableCell>
                                <TableCell >ngày chỉnh sửa</TableCell>
                                <TableCell >hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admin.map((ad, index) => (
                                <TableRow
                                    key={ad.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell >{ad.email}</TableCell>
                                    <TableCell >{ad.name}</TableCell>
                                    <TableCell >{ad.create_at}</TableCell>
                                    <TableCell >{ad.update_at}</TableCell>
                                    <TableCell >
                                        <Stack direction="row" spacing={1}>
                                            <div>
                                                <Button variant="contained" color="success" onClick={() => toggleForm(ad)}>chỉnh sửa</Button>
                                                <Dialog open={isOpen} onClose={toggleForm} fullWidth maxWidth="sm">
                                                    <DialogTitle>Thêm Tài Khoản</DialogTitle>
                                                    <DialogContent>
                                                        <Form onSubmit={onsubmit}>
                                                            {err != null ? <Alert severity="error">{err}</Alert> : null}
                                                            <TextField onChange={handleChange} value={adminEdit?.email} name='email' autoFocus margin="dense" label="Tên tài khoản" type="text" fullWidth />
                                                            <TextField onChange={handleChange} value={adminEdit?.name} name='name' autoFocus margin="dense" label="Tên người dùng" type="text" fullWidth />
                                                            <TextField value={adminEdit?.password} disabled autoFocus margin="dense" label="Mật khẩu" type="password" fullWidth />
                                                            <TextField onChange={handleChange} value={adminEdit?.phone} name='phone' autoFocus margin="dense" label="Số điện thoại" type="text" fullWidth />
                                                            <Form.Group className="mb-3" id="form-password">
                                                                <Form.Label>
                                                                    Chọn tỉnh thành <span style={{ color: "red" }}>*</span>
                                                                </Form.Label>
                                                                <Form.Select
                                                                    name="province"
                                                                    aria-label="Default select example"
                                                                    onChange={handleSelectProvince}
                                                                >
                                                                    <option value="">-- Chọn tỉnh thành --</option>
                                                                    {provinces != null
                                                                        ? provinces.map((item) => {
                                                                            return (
                                                                                <option
                                                                                    selected={adminEdit.province === item.name}
                                                                                    key={item.id}
                                                                                    value={JSON.stringify({
                                                                                        id: item.id,
                                                                                        name: item.name,
                                                                                    })}
                                                                                >
                                                                                    {item.name}
                                                                                </option>
                                                                            );
                                                                        })
                                                                        : ""}
                                                                </Form.Select>
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" id="form-password">
                                                                <Form.Label>
                                                                    Chọn quận/huyện <span style={{ color: "red" }}>*</span>
                                                                </Form.Label>
                                                                <Form.Select
                                                                    name="district"
                                                                    aria-label="Default select example"
                                                                    onChange={handleSelectDistrict}
                                                                >
                                                                    <option value="">-- Chọn quận/huyện --</option>
                                                                    {districts != null
                                                                        ? districts.map((item) => {
                                                                            return (
                                                                                <option
                                                                                    selected={adminEdit.district === item.name}
                                                                                    key={item.id}
                                                                                    value={JSON.stringify({
                                                                                        id: item.id,
                                                                                        name: item.name,
                                                                                    })}
                                                                                >
                                                                                    {item.name}
                                                                                </option>
                                                                            );
                                                                        })
                                                                        : ""}
                                                                </Form.Select>
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" id="form-password">
                                                                <Form.Label>
                                                                    Chọn xã/phường <span style={{ color: "red" }}>*</span>
                                                                </Form.Label>
                                                                <Form.Select
                                                                    onChange={handleSelectWard}
                                                                    name="ward"
                                                                    aria-label="Default select example"
                                                                >
                                                                    <option value="">-- Chọn xã/phường --</option>
                                                                    {wards != null
                                                                        ? wards.map((item) => {
                                                                            return (
                                                                                <option
                                                                                    selected={adminEdit.ward === item.name}
                                                                                    key={item.id}
                                                                                    value={JSON.stringify({
                                                                                        id: item.id,
                                                                                        name: item.name,
                                                                                    })}
                                                                                >
                                                                                    {item.name}
                                                                                </option>
                                                                            );
                                                                        })
                                                                        : ""}
                                                                </Form.Select>
                                                            </Form.Group>
                                                            <TextField onChange={handleChange} value={adminEdit?.address} name='address' autoFocus margin="dense" label="Địa chỉ" type="text" fullWidth />
                                                            <DialogActions>
                                                                <Button onClick={toggleForm} color="primary">Hủy</Button>
                                                                <Button type='submit' color="primary">Gửi</Button>
                                                            </DialogActions>
                                                        </Form>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            {ad.status === 0 ? (
                                                <Button variant="contained" color="success" onClick={() => handleChangeStatus(ad.id, 1)}>
                                                    Kích hoạt
                                                </Button>
                                            ) : ad.status === 1 ? (
                                                <Button variant="contained" color="error" onClick={() => handleChangeStatus(ad.id, 2)}>
                                                    Chặn
                                                </Button>
                                            ) : ad.status === 2 ? (
                                                <Button variant="contained" color="primary" onClick={() => handleChangeStatus(ad.id, 1)}>Bỏ chặn</Button>
                                            ) : null}
                                            <Button variant="contained" color="error" onClick={() => handleDelete(ad.id)}>Xóa</Button>
                                        </Stack >
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        )
    }
}

export default TableAdmin
