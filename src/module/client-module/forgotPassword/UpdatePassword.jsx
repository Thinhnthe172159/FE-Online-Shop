import React from 'react';
import { Box, Button, Stack, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./ForgotPassword.scss"
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { changePasswordByCode } from '../../../api/customerApi';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_EMAIL } from '../../../redux/slice/ForgotPasswordSlice';
import Swal from "sweetalert2";
const UpdatePassword = () => {

    const email = useSelector(state => state.forgot.email)
    console.log(email);

    const dispatch = useDispatch()

    const formData = [
        {
            label: "Mật khẩu mới",
            placeholder: "Nhập mật khẩu mới",
            name: "newPassword",
            type: "password"
        },
        {
            label: "Nhập lại mật khẩu mới",
            placeholder: "Nhập lại mật khẩu mới",
            name: "confirmPassword",
            type: "password"
        }
    ];
    const schema = yup
        .object({
            newPassword: yup
                .string()
                .required("Vui lòng nhập mật khẩu mới")
                .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
                .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ cái viết hoa"),

            confirmPassword: yup
                .string()
                .required("Vui lòng nhập lại mật khẩu mới")
                .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp")
        });

    const navigate = useNavigate();

    const navigateToLogin = () => {
        console.log("navigateToLogin");
        return navigate("/login");
    }

    const { mutate } = useMutation({
        mutationFn: (data) => changePasswordByCode(data),
        onSuccess: (data) => {
            console.log("data", data);
            Swal.fire({
                icon: "success",
                title: "Cập nhật tài khoản thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
            navigateToLogin();
            dispatch(DELETE_EMAIL());

        },
        onError: (error) => {
            console.log("error", error);
            alert("Đổi mật khẩu thất bại");
        }
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema),
        mode: "all"
    });

    const onSubmit = (data) => {

        data["email"] = email
        console.log("data", data);
        mutate(data);
    }

    return (
        <section style={{ backgroundColor: "#f3f3f3" }} id="forgot-password">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={3}>
                    <Typography variant="h5" sx={{ fontWeight: "600" }} color="initial">
                        Đổi mật khẩu mới
                    </Typography>

                    {errors.newPassword && <span style={{ color: 'red' }}>{errors.newPassword.message}</span>}
                    {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}

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
                        type="submit"
                        sx={{
                            backgroundColor: "#ffcf20",
                            color: "#1b1b1b",
                            borderRadius: "999px",
                            textTransform: "capitalize",
                        }}
                    >
                        <b>đổi mật khẩu </b>
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

export default UpdatePassword
