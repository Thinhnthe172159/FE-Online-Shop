import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "./register.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const formData = [
  {
    label: "Họ và tên",
    placeholder: "Nhập tên người dùng",
    name: "name",
    type: "text",
  },
  {
    label: "Email",
    placeholder: "Nhập email",
    name: "email",
    type: "text",
  },
  {
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    name: "password",
    type: "password",
  },
  {
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    name: "confirmPassword",
    type: "password",
  },
];

const formShipData = [
  {
    label: "Họ và tên",
    placeholder: "Nhập tên người dùng",
    name: "name",
    type: "text",
  },
  {
    label: "Số điện thoại",
    placeholder: "Nhập Số điện thoại",
    name: "phone",
    type: "text",
  },
  {
    label: "CCCD/CMT",
    placeholder: "Nhập CCCD/CMT",
    name: "identity",
    type: "text",
  },
  {
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    name: "password",
    type: "password",
  },
  {
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    name: "confirmPassword",
    type: "password",
  },
];

const Register = () => {
  const [type, setType] = useState("");
  const [formContent, setFormContent] = useState(formData);

  const navigate = useNavigate();

  const login = useSelector((state) => state.auth.login);
  if (login) {
    return <Navigate to={"/"}></Navigate>;
  }

  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const schema = yup
    .object({
      name: yup.string().required("Vui lòng nhập họ và tên"),
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
          "Email không đúng định dạng"
        ),
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự"), // Kiểm tra ít nhất 1 chữ hoa
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu"),
    })
    .required();

  const schemaShipper = yup
    .object({
      name: yup.string().required("Vui lòng nhập họ và tên"),
      phone: yup
        .string()
        .required("Vui lòng nhập Số điện thoại")
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          "Số điện thoại không đúng định dạng"
        ),
      identity: yup
        .string()
        .required("Vui lòng nhập CCCD")
        .length(12, "CCCD 12 ký tự"),
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự"), // Kiểm tra ít nhất 1 chữ hoa
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      comfirmPassword: "",
      phone: "",
      identity: "",
    },
    resolver: yupResolver(type === 'ship' ? schemaShipper : schema),
    mode: "all",
  });

  const submitData = (data) => {
    if (type === "customer") {
      axios
        .post("http://localhost:8080/auth/customer/sign-up", data)
        .then((content) => {
          Swal.fire({
            text: "Đăng ký thành công. Vui lòng đăng nhập để tiếp tục",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }
          });
        })
        .catch((error) => {
          if (error.response) {
            setErr(error.response.data.message);
            setSuccess(null);
          }
        });
    } else {
      axios
        .post("http://localhost:8080/auth/shipper/sign-up", data)
        .then((content) => {
          Swal.fire({
            text: "Đăng ký thành công. Vui lòng đăng nhập để tiếp tục",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }
          });
        })
        .catch((error) => {
          if (error.response) {
            setErr(error.response.data.message);
            setSuccess(null);
          }
        });
    }
  };

  const handleSelectCustomerType = (type) => {
    setType(type);
    if (type === "ship") {
      setFormContent(formShipData);
    } else {
      setFormContent(formData);
    }
  };

  return (
    <>
      <section style={{ backgroundColor: "#f3f3f3" }} id="sign-up">
        {!type && (
          <div className="customer-type">
            <h3>Bạn là: </h3>
            <div className="customer-type-wrap">
              <div
                className={type === "ship" ? "elem active" : "elem"}
                onClick={() => handleSelectCustomerType("ship")}
              >
                Shipper
              </div>
              <div
                className={type === "customer" ? "elem active" : "elem"}
                onClick={() => handleSelectCustomerType("customer")}
              >
                Khách hàng
              </div>
            </div>
          </div>
        )}
        {type && (
          <>
            <form
              action=""
              onSubmit={handleSubmit(submitData)}
              style={{ top: type === "ship" ? "47%" : "40%" }}
            >
              <Stack gap={3}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "600" }}
                  color="initial"
                >
                  Đăng ký tài khoản
                </Typography>
                {err != null ? <Alert severity="error">{err}</Alert> : ""}
                {success != null ? (
                  <Alert severity="success">{success}</Alert>
                ) : (
                  ""
                )}
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
                <Button
                  sx={{
                    color: "#1b1b1b",
                    borderRadius: "999px",
                    textTransform: "capitalize",
                  }}
                  onClick={() => setType("")}
                >
                  <b>Quay lại</b>
                </Button>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "#ffcf20",
                    color: "#1b1b1b",
                    borderRadius: "999px",
                    textTransform: "capitalize",
                  }}
                >
                  <b>Đăng ký</b>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "white",
                    color: "#1b1b1b",
                    border: "solid 1px #ccc",
                    borderRadius: "999px",
                    textTransform: "capitalize",
                  }}
                >
                  <b>
                    Đã có tài khoản? Đăng nhập{" "}
                    <ArrowForwardIcon></ArrowForwardIcon>
                  </b>
                </Button>
              </Stack>
            </form>
          </>
        )}
      </section>
    </>
  );
};

export default Register;
