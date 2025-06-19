import React, { useState } from "react";
import "./ForgotPasswordShop.scss";
import { useForm } from "react-hook-form";
import { Alert } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { checkCode } from "../../../api/ShopOwnerApi";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, LOGOUT } from "../../../redux/slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../client-module/loading/Loading";
import { SAVE_EMAIL } from "../../../redux/slice/ForgotPasswordSlice";

const Sendcode = () => {
    const email = useSelector(state => state.forgot.email);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { mutate, isLoading } = useMutation({
        mutationFn: (data) => checkCode(data),
        onSuccess: (response) => {
            navigate("/shop/reset-password");
        },
        onError: (error) => {
            console.log(error);
            if (error.response) {
                setErr(error.response.data.message);
            } else {
                setErr("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        }
    })

    const [err, setErr] = useState(null);

    const schema = yup
        .object({
            code: yup
                .string()
                .required("Vui lòng nhập mã xác thực")
                .min(8, "Mã xác thực phải có 8 ký tự")
        })

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            code: ""
        },
        resolver: yupResolver(schema),
        mode: "onSubmit",
    });

    const onError = (errors) => {
        // Display the first error found
        if (errors.email) {
            setErr(errors.email.message);
        } else if (errors.password) {
            setErr(errors.password.message);
        }
    };

    const onSubmit = (data) => {
        console.log("data", data);
        mutate(data);
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div id="login-seller">
            <div className="wrapper">
                <div className="logo">
                    <img src="https://res.cloudinary.com/dzq9ac2qd/image/upload/v1742304897/logo_xrx34y.png" alt="logo" />
                </div>
                <div className="text-center mt-4 name">Quản lý cửa hàng</div>

                <form className="p-3 mt-3" onSubmit={handleSubmit(onSubmit, onError)}>
                    {err && <Alert variant="danger">{err}</Alert>}
                    <div className="form-field d-flex align-items-center">
                        <span className="far fa-user" />
                        <input
                            type="text"
                            name="code"
                            placeholder="Nhập Mã Xác Thực"
                            {...register("code")}
                        />
                    </div>
                    <button className="btn mt-3">Xác thực</button>
                </form>

                <div className="text-center fs-6">
                    <a href="/shop/login">Bạn đã là thành viên? Đăng nhập ngay!</a>
                </div>
            </div>
        </div>
    );
};

export default Sendcode;