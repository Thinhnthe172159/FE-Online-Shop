import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    CircularProgress,
    Paper
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "../../../api/AdminApi";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    background: "#ffffff",
    maxWidth: "600px",
    margin: "2rem auto",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)"
    }
}));

const FormField = styled(TextField)(({ theme }) => ({
    marginBottom: "1.5rem",
    "& .MuiInputBase-root": {
        borderRadius: "8px",
        transition: "all 0.3s ease"
    },
    "& .MuiOutlinedInput-root:hover": {
        "& > fieldset": {
            borderColor: "#1976d2"
        }
    }
}));

const ChangePasswordAdmin = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
        validateField(field, event.target.value);
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case "oldPassword":
                if (!value) {
                    newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
                } else {
                    delete newErrors.oldPassword;
                }
                break;
            case "password":
                if (!value) {
                    newErrors.password = "Mật khẩu mới là bắt buộc";
                } else if (value.length < 8) {
                    newErrors.password = "Mật khẩu mới phải có ít nhất 8 ký tự";
                } else {
                    delete newErrors.password;
                }
                if (formData.confirmPassword && value !== formData.confirmPassword) {
                    newErrors.confirmPassword = "Mật khẩu không khớp";
                } else if (formData.confirmPassword) {
                    delete newErrors.confirmPassword;
                }
                break;
            case "confirmPassword":
                if (!value) {
                    newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu của bạn";
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = "Mật khẩu không khớp";
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const { mutate } = useMutation({
        mutationFn: (data) => changePassword(data),
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Cập nhật mật khẩu thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
        },
        onError: (error) => {
            console.log("error", error);
            setErrors({ ...errors, ...error.response.data });
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.keys(errors).length > 0) return;

        setIsLoading(true);
        mutate(formData);
        setIsLoading(false);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <Container>
            <StyledPaper elevation={3}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: "#1976d2" }}>
                    Đổi mật khẩu
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormField
                        fullWidth
                        required
                        label="Mật khẩu hiện tại"
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.oldPassword}
                        onChange={handleChange("oldPassword")}
                        error={!!errors.oldPassword}
                        helperText={errors.oldPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle current password visibility"
                                        onClick={() => togglePasswordVisibility("current")}
                                        edge="end"
                                    >
                                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <FormField
                        fullWidth
                        required
                        label="Mật khẩu mới"
                        type={showPasswords.new ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange("password")}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle new password visibility"
                                        onClick={() => togglePasswordVisibility("new")}
                                        edge="end"
                                    >
                                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <FormField
                        fullWidth
                        required
                        label="Nhập lại mật khẩu mới"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => togglePasswordVisibility("confirm")}
                                        edge="end"
                                    >
                                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading || Object.keys(errors).length > 0}
                        sx={{
                            mt: 2,
                            height: "48px",
                            borderRadius: "8px",
                            background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                            "&:hover": {
                                background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)"
                            }
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Thay Đổi Mật Khẩu"
                        )}
                    </Button>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default ChangePasswordAdmin;