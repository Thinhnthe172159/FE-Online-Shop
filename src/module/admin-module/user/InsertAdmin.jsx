import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../main';
import { InsertAdmins } from '../../../api/AdminApi';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from '../../client-module/loading/Loading';

const InsertAdmin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [admin, setAdmin] = useState({
        email: "",
        name: "",
        password: "",
        phone: "",
        address: "",
        district: "",
        ward: "",
        province: ""
    });
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
        setAdmin({ ...admin, province: value.name, district: "", ward: "" }); // Set province name in admin state
        setErr(null);
    };

    const handleSelectDistrict = (e) => {
        const value = JSON.parse(e.target.value);
        setSelectDistrict(value);
        setSelectWard("");
        setAdmin({ ...admin, district: value.name, ward: "" }); // Set district name in admin state
        setErr(null);
    };

    const handleSelectWard = (e) => {
        const value = JSON.parse(e.target.value);
        setSelectWard(value);
        setAdmin({ ...admin, ward: value.name }); // Set ward name in admin state
        setErr(null);
    };

    const toggleForm = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setAdmin({
                email: "",
                name: "",
                password: generatePassword(),
                phone: "",
                address: "",
                district: "",
                ward: "",
                province: ""
            });
        }
    };

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

    const handleChange = (e) => {
        setAdmin({
            ...admin,
            [e.target.name]: e.target.value,
        });
    };

    const onsubmit = (e) => {
        e.preventDefault();
        if (admin.email === "") {
            setErr("Vui lòng nhập email");
            return;
        } else if (!admin.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
            setErr("Vui lòng sửa lại email");
            return;
        } else if (admin.name === "") {
            setErr("Vui lòng nhập tên");
            return;
        } else if (admin.phone === "") {
            setErr("Vui lòng nhập số điện thoại");
            return;
        } else if (admin.phone.length !== 10) {
            setErr("Vui lòng nhập lại số điện thoại");
            return;
        } else if (admin.address === "") {
            setErr("Vui lòng nhập địa chỉ");
            return;
        } else if (!admin.district) {
            setErr("Vui lòng chọn quận huyện");
            return;
        } else if (!admin.ward) {
            setErr("Vui lòng chọn phường xã");
            return;
        } else if (!admin.province) {
            setErr("Vui lòng chọn tỉnh thành phố");
            return;
        } else {
            setErr(null);
            mutate(admin);
        }
    };
    const { mutate, isLoading } = useMutation({
        mutationFn: (data) => InsertAdmins(data),
        onSuccess: () => {
            queryClient.refetchQueries(["admin"]);
            setIsOpen(false);
            Swal.fire({
                icon: "success",
                title: "Thêm tài khoản thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
        },
        onError: (err) => {
            console.log(err.response.data.message);
            if (err.response) {
                setErr(err.response.data.message);
            }
        }
    });

    if (isLoading) {
        return <Loading />
    }
    return (
        <div>
            <Button variant="contained" onClick={toggleForm}>Thêm Tài Khoản</Button>

            <Dialog open={isOpen} onClose={toggleForm} fullWidth maxWidth="sm">
                <DialogTitle>Thêm Tài Khoản</DialogTitle>
                <DialogContent>
                    <Form onSubmit={onsubmit}>
                        {err != null ? <Alert severity="error">{err}</Alert> : null}
                        <TextField onChange={handleChange} value={admin.email} name='email' autoFocus margin="dense" label="Tên tài khoản" type="text" fullWidth />
                        <TextField onChange={handleChange} value={admin.name} name='name' autoFocus margin="dense" label="Tên người dùng" type="text" fullWidth />
                        <TextField value={admin.password} disabled autoFocus margin="dense" label="Mật khẩu" type="password" fullWidth />
                        <TextField onChange={handleChange} value={admin.phone} name='phone' autoFocus margin="dense" label="Số điện thoại" type="text" fullWidth />
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
                                                selected={admin.province === item.name}
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
                                                selected={admin.district === item.name}
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
                                                selected={admin.ward === item.name}
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
                        <TextField onChange={handleChange} value={admin.address} name='address' autoFocus margin="dense" label="Địa chỉ" type="text" fullWidth />
                        <DialogActions>
                            <Button onClick={toggleForm} color="primary">Hủy</Button>
                            <Button type='submit' color="primary">Gửi</Button>
                        </DialogActions>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InsertAdmin;
