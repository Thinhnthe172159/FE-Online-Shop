import React from 'react';
import { Box, Button, Stack, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./ForgotPassword.scss"
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { changePasswordByCode, checkCode } from '../../../api/customerApi'; // Thêm import cho hàm changePasswordByCode
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'; // Thêm import Swal

const CheckCode = () => {
    const email = useSelector(state => state.forgot.email);
    const formData = [
        {
            label: "Xác thực tài khoản",
            placeholder: "Nhập mã xác thực",
            name: "code",
            type: "text"
        },
    ];

    const schema = yup
    .object({
        code: yup
        .string()
        .required("Vui lòng nhập mã xác thực")
        .min(8, "Mã xác thực phải có 8 ký tự") // Đảm bảo mã xác thực có 8 ký tự
    });

    const navigate = useNavigate();

    const navigateToLogin = () => {
        console.log("navigateToLogin");
        return navigate("/login");
    }

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            code: "",
        },
        resolver: yupResolver(schema),
        mode: "all"
    });

    const { mutate } = useMutation({
        mutationFn: (data) => checkCode({
            code: data.code,
            email: email
        }),
        onSuccess: (response) => {
            Swal.fire({
                icon: 'success',
                title: 'Xác thực thành công',
                text: response.message || 'Mã xác thực chính xác',
                confirmButtonColor: '#28a745',
            }).then(() => {
                navigate("/reset-password");
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Xác thực thất bại',
                text: error.response?.data?.message || 'Mã xác thực không hợp lệ',
                confirmButtonColor: '#dc3545',
            });
        }
    });

    const onSubmit = (data) => {
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không tìm thấy email. Vui lòng thực hiện lại từ đầu',
                confirmButtonColor: '#dc3545',
            });
            return;
        }
        mutate(data);
    }

    return (
        <section style={{ backgroundColor: "#f3f3f3" }} id="forgot-password">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={3}>
                    <Typography variant="h5" sx={{ fontWeight: "600" }} color="initial">
                        Nhập mã xác thực
                    </Typography>

                    {errors.code && <span style={{ color: 'red' }}>{errors.code.message}</span>} {/* Hiển thị lỗi nếu có */}

                    {formData.map((item) => {
                        return (
                            <Form.Group key={item.name} className="form-input">
                                <Form.Label className="label">
                                    {item.label} <span>*</span>
                                </Form.Label>
                                <Controller
                                    name={item.name}
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            className="mb-0"
                                            type={item.type}
                                            placeholder={item.placeholder}
                                        />
                                    )}
                                />
                            </Form.Group>
                        );
                    })}
                    <Button
                        type="submit" // Đổi type thành submit
                        sx={{
                            backgroundColor: "#ffcf20",
                            color: "#1b1b1b",
                            borderRadius: "999px",
                            textTransform: "capitalize",
                        }}
                    >
                        <b>Đổi mật khẩu</b>
                    </Button>
                    <Button
                        type="button"
                        onClick={navigateToLogin}
                        sx={{
                            backgroundColor: "white",
                            color: "#1b1b1b",
                            borderRadius: "999px",
                            textTransform: "capitalize",
                            border: "1px solid rgba(0, 0, 0, 0.5) !important",
                        }}
                    >
                        <b>Bạn đã là thành viên? Đăng nhập ngay!</b>
                    </Button>
                </Stack>
            </form>
        </section>
    );
}

export default CheckCode
