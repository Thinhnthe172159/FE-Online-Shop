import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import "./login.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, LOGIN_SHIPPER } from "../../../redux/slice/AuthSlice";

const formData = [
  {
    label: "Email",
    placeholder: "Nhập email",
    name: "email",
    type: "text"
  },
  {
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    name: "password",
    type: "password"
  },
];

const shipperFormData = [
  {
    label: "Số điện thoại",
    placeholder: "Nhập Số điện thoại",
    name: "phone",
    type: "text"
  },
  {
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    name: "password",
    type: "password"
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const login = useSelector((state) => state.auth.login)
  const [type, setType] = useState("customer");
  const [formContent, setFormContent] = useState(formData);
  const [err, setErr] = useState(null)
  const [success, setSuccess] = useState(null)

  const schema = yup
    .object({
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),
      password: yup.string().required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    })
    .required();

  const schemaShipper = yup
    .object({
      phone: yup
        .string()
        .required("Vui lòng nhập Số điện thoại")
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          "Số điện thoại không đúng định dạng"
        ),
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự"), // Kiểm tra ít nhất 1 chữ hoa
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(type === 'ship' ? schemaShipper : schema),
    mode: "all"
  });



  const submitData = (data) => {
    if (type === 'customer') {
      axios.post("http://localhost:8080/auth/customer/sign-in", data)
        .then((content) => {
          let response = content.data.data
          dispatch(LOGIN(response))
          navigate("/")
        })
        .catch((error) => {
          console.log(error);

          if (error.response) {
            setErr(error.response.data.message)
          }
        });
    }
    else {
      axios.post("http://localhost:8080/auth/shipper/sign-in", data)
        .then((content) => {
          let response = content.data.data
          dispatch(LOGIN_SHIPPER(response))
          navigate("/shipper")
        })
        .catch((error) => {
          if (error.response) {
            setErr(error.response.data.message)
          }
        });
    }
  }

  const handleSetType = (type) => {
    setType(type)
    if (type === "ship") {
      setFormContent(shipperFormData);
    } else {
      setFormContent(formData);
    }
  }

  useEffect(() => {
    if (login && type === 'customer') {
      return <Navigate to={"/"}></Navigate>
    }
  }, [login])

  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="login">
      <form action="" onSubmit={handleSubmit(submitData)}>
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: "600" }} color="initial">
            Đăng nhập
          </Typography>
          {err != null ? <Alert severity="error">{err}</Alert> : ""}
          {formContent.map((item) => {
            return (
              <Form.Group key={item.name} className="form-input">
                <Form.Label className="label">
                  {item.label} <span>*</span>
                </Form.Label>
                <Form.Control
                  className="mb-0"
                  type={item.type}
                  isInvalid={Boolean(errors[item.name])}
                  {...register(item.name)}
                  name={item.name}
                  placeholder={item.placeholder}
                />
                {Boolean(errors[item.name]) ? (
                  <Form.Control.Feedback type="invalid">
                    {errors[item.name].message}
                  </Form.Control.Feedback>
                ) : (
                  ""
                )}
              </Form.Group>
            );
          })}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <NavLink to={"/forgotPassword"}>Quên mật khẩu?</NavLink>
          </Box>
          <Button
            type="submit"
            sx={{

              backgroundColor: "#ffcf20",
              color: "#1b1b1b",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
          >
            <b>Đăng nhập</b>
          </Button>
          {type == 'customer' && <Button
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              border: "solid 1px #ccc",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
            onClick={() => handleSetType('ship')}
          >
            <b>Bạn là Shipper?</b>
          </Button>}
          {type == 'ship' && <Button
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              border: "solid 1px #ccc",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
            onClick={() => handleSetType('customer')}
          >
            <b>Bạn là Khách hàng?</b>
          </Button>}
          <Button
            onClick={() => navigate("/register")}
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              border: "solid 1px #ccc",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
          >
            <b>
              Đăng ký tài khoản mới <ArrowForwardIcon></ArrowForwardIcon>
            </b>
          </Button>
        </Stack>
      </form>
    </section>
  );
};

export default Login;
