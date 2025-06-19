import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  Link,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { LOGIN, LOGOUT } from "../../../redux/slice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

// Định nghĩa schema với yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
});

const AdminLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth);
  const [err, setErr] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Tích hợp yup để kiểm tra form
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:8080/auth/admin/login",data)
    .then((content) => {
      let response = content.data.data  
      dispatch(LOGOUT())
      dispatch(LOGIN(response))
      navigate("/admin")
    })
    .catch((error) => {
      if (error.response) {
        setErr(error.response.data.message)
      } 
    });
    // Bạn có thể thực hiện các thao tác xử lý dữ liệu tại đây, ví dụ: gửi dữ liệu đến server.
  };
  useEffect(() => {
    if (auth.login) { // Kiểm tra nếu user đã đăng nhập
      navigate("/admin");
    }
  }, [auth.login,navigate]); 
  if(auth.login &&( auth.role == "admin"|| auth.role == "superAdmin")){
    return <Navigate to={"/admin"}></Navigate>
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
          Đăng nhập để truy cập quản trị
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
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email or username"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
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
            Sign in
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <Link href="/admin-gate/forgot-password" sx={{ color: "#6c5ce7", fontWeight: "bold" }}>
              Quên mật khẩu
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminLogin;
