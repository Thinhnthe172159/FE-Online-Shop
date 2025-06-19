import React, { useState } from "react";
import "./ForgotPasswordShop.scss";
import { useForm } from "react-hook-form";
import { Alert } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword, loginSeller } from "../../../api/ShopOwnerApi";
import { useDispatch } from "react-redux";
import { LOGIN, LOGOUT } from "../../../redux/slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../client-module/loading/Loading";
import { SAVE_EMAIL } from "../../../redux/slice/ForgotPasswordSlice";

const ForgotPasswordShop = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => forgotPassword(data),
    onSuccess: (response) => {
      console.log(response);
      dispatch(SAVE_EMAIL(response))
      return navigate("/shop/send-code");
    },
    onError: (error) => {
      console.log(error);
      if (err.response) {
        setErr(error.response.data.message);
      }

    }
  })


  const [err, setErr] = useState(null);

  const schema = yup
    .object({
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
          "Email không đúng định dạng"
        )
    })

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ""
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = (data) => {

    mutate(data); // Gọi mutate với dữ liệu email
  };

  if (isPending) {
    return <Loading />
  }

  return (
    <div id="login-seller">
      <div className="wrapper">
        <div className="logo">
          <img src="https://res.cloudinary.com/dzq9ac2qd/image/upload/v1742304897/logo_xrx34y.png" alt="logo" />
        </div>
        <div className="text-center mt-4 name">Quản lý cửa hàng</div>

        <form className="p-3 mt-3" onSubmit={handleSubmit(onSubmit)}>
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
          <button type="submit" className="btn mt-3">Lấy lại mật khẩu</button>
        </form>

        <div className="text-center fs-6">
          <a href="/shop/login">Bạn đã là thành viên? Đăng nhập ngay!</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordShop;