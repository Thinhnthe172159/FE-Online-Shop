import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordByCode } from "../../../api/AdminApi";
import { useMutation } from "@tanstack/react-query";
import Loading from "../../client-module/loading/Loading";
import { useNavigate } from "react-router-dom";
import { DELETE_EMAIL } from "../../../redux/slice/ForgotPasswordSlice";
import Swal from "sweetalert2";

// Định nghĩa schema với yup
const schema = yup.object().shape({
    newPassword: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới")
        .matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
            "Mật khẩu phải có ít nhất 1 chữ cái hoa, 1 số, 1 ký tự đặc biệt và ít nhất 6 ký tự"
        ),
    confirmPassword: yup
        .string()
        .required("Vui lòng xác thực lại mật khẩu")
        .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp")
});

const ResetPasswordAdmin = () => {
    const email = useSelector(state => state.forgot.email);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [err, setErr] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema), // Tích hợp yup để kiểm tra form
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => changePasswordByCode(data),
        onSuccess: (data) => {
            console.log("data", data);
            Swal.fire({
                icon: "success",
                title: "Cập nhật mật khẩu thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
            dispatch(DELETE_EMAIL());
            navigate("/admin-gate/login");
        },
        onError: (error) => {
            console.log("error", error);
            setErr("Đổi mật khẩu thất bại");
        }
    });

    const onSubmit = (data) => {
        console.log(data);

        setErr(null);
        data['email'] = email;
        mutate(data);
    };

    if (isPending) {
        return <Loading />;
    }

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: 3,
                    padding: 4,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{ fontWeight: "bold", mb: 1 }}
                >
                    Welcome to 6MEMs! 👋
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3, textAlign: "center" }}
                >
                    Nhập lại mật khẩu mới của bạn
                </Typography>
                {/* Hiển thị cảnh báo lỗi nếu có lỗi */}
                {err && (
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                        {err}
                    </Alert>
                )}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ width: "100%" }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="newPassword"
                        label="Mật khẩu mới"
                        type="password"
                        name="newPassword"
                        autoComplete="new-password"
                        placeholder="Nhập mật khẩu mới"
                        autoFocus
                        {...register("newPassword")}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword ? errors.newPassword.message : ""}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Xác thực lại mật khẩu"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            background: "#6c5ce7",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Cập nhật mật khẩu
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        <Link href="/admin-gate/login" sx={{ color: "#6c5ce7", fontWeight: "bold" }}>
                            Bạn đã là thành viên? Đăng nhập ngay!
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPasswordAdmin;
