import React, { useState } from "react";
import "./loginseller.scss";
import { useForm } from "react-hook-form";
import { Alert } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { loginSeller } from "../../../api/ShopOwnerApi";
import { useDispatch } from "react-redux";
import { LOGIN, LOGOUT } from "../../../redux/slice/AuthSlice";
import { useNavigate } from "react-router-dom";

const LoginSeller = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {mutate} = useMutation({
      mutationFn: (data) => loginSeller(data),
      onSuccess: (response) => { 
          dispatch(LOGOUT())
          dispatch(LOGIN(response))
          navigate("/seller")
      },
      onError:(err) => {
        console.log(err);
        
          if(err.response){
             setErr(err.response.data.message)
          }
      }
  })

  const [err, setErr] = useState(null);

  // Schema validation using yup
  const schema = yup.object({
    email: yup
      .string()
      .required("Vui lòng nhập email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
        "Email không đúng định dạng"
      ),
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu")
      ,
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const handleData = (data) => {
    setErr(null); // Reset error when form is valid
    mutate(data)
  };

  const onError = (errors) => {
    // Display the first error found
    if (errors.email) {
      setErr(errors.email.message);
    } else if (errors.password) {
      setErr(errors.password.message);
    }
  };

  return (
    <div id="login-seller">
      <div className="wrapper">
        <div className="logo">
          <img src="https://res.cloudinary.com/dzq9ac2qd/image/upload/v1742304897/logo_xrx34y.png" alt="logo" />
        </div>
        <div className="text-center mt-4 name">Quản lý cửa hàng</div>

        <form className="p-3 mt-3" onSubmit={handleSubmit(handleData, onError)}>
          {err && <Alert variant="danger">{err}</Alert>}

          <div className="form-field d-flex align-items-center">
            <span className="far fa-user" />
            <input
              type="text"
              name="email"
              placeholder="Nhập Email"
              {...register("email")}
            />
          </div>
          
          <div className="form-field d-flex align-items-center">
            <span className="fas fa-key" />
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
          </div>
          
          <button className="btn mt-3">Đăng nhập</button>
        </form>

        <div className="text-center fs-6">
          <a href="/shop/forgot-password">Quên mật khẩu</a>
        </div>
      </div>
    </div>
  );
};

export default LoginSeller;
