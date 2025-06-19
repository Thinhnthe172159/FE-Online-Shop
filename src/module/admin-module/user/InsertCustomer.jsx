import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { Form } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../main';
import { InsertCustomers } from '../../../api/customerApi';
import Swal from 'sweetalert2';

const InsertCustomer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [customer, setCustomer] = useState({
        email: "",
        name: "",
        password: ""
    });
    const [err, setErr] = useState(null);

    const toggleForm = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setCustomer({
                email: "",
                name: "",
                password: generatePassword()
            });
            setErr(null);
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
        const { name, value } = e.target;
        setCustomer(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setErr(null);
    };

    const validateForm = () => {
        if (!customer.email.trim()) {
            setErr("Vui lòng nhập email");
            return false;
        }
        if (!customer.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
            setErr("Vui lòng nhập email hợp lệ");
            return false;
        }
        if (!customer.name.trim()) {
            setErr("Vui lòng nhập tên");
            return false;
        }
        if (customer.name.length < 2) {
            setErr("Tên phải có ít nhất 2 ký tự");
            return false;
        }
        return true;
    };

    const onsubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            mutate(customer);
        }
    };

    const { mutate } = useMutation({
        mutationFn: (data) => InsertCustomers(data),
        onSuccess: () => {
            queryClient.refetchQueries(["customers"]);
            setIsOpen(false);
            Swal.fire({
                icon: "success",
                title: "Thêm tài khoản thành công",
                text: "Tài khoản mới đã được tạo thành công",
                confirmButtonText: "Đóng",
                confirmButtonColor: "#28a745",
            });
            // Reset form
            setCustomer({
                email: "",
                name: "",
                password: ""
            });
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi thêm tài khoản";
            setErr(errorMessage);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorMessage,
                confirmButtonText: "Đóng",
                confirmButtonColor: "#dc3545",
            });
        }
    });

    return (
        <div>
            <Button variant="contained" onClick={toggleForm}>Thêm Khách Hàng</Button>

            <Dialog open={isOpen} onClose={toggleForm} fullWidth maxWidth="sm">
                <DialogTitle>Thêm Tài Khoản</DialogTitle>
                <DialogContent>
                    <Form onSubmit={onsubmit}>
                        {err && <Alert severity="error" className="mb-3">{err}</Alert>}
                        <TextField 
                            onChange={handleChange} 
                            value={customer.email} 
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
                            value={customer.name} 
                            name='name' 
                            margin="dense" 
                            label="Tên người dùng" 
                            type="text" 
                            fullWidth 
                            required
                            error={!!err && err.includes('tên')}
                        />
                        <TextField 
                            value={customer.password} 
                            disabled 
                            margin="dense" 
                            label="Mật khẩu" 
                            type="password" 
                            fullWidth 
                        />
                        <DialogActions>
                            <Button onClick={toggleForm} color="error">Hủy</Button>
                            <Button type='submit' color="primary" variant="contained">Thêm</Button>
                        </DialogActions>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InsertCustomer;
