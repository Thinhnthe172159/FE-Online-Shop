import React, { useState } from "react";
import "./ForgotPasswordShop.scss";
import { useForm } from "react-hook-form";
import { Alert } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { changePasswordByCode } from "../../../api/ShopOwnerApi";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, LOGOUT } from "../../../redux/slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import { DELETE_EMAIL } from "../../../redux/slice/ForgotPasswordSlice";
import Swal from "sweetalert2";

const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const email = useSelector(state => state.forgot.email)
    console.log("email", email);

    const { mutate } = useMutation({
        mutationFn: (data) => changePasswordByCode(data),
        onSuccess: (data) => {
            Swal.fire({
                icon: "success",
                title: "Cập nhật tài khoản thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
            dispatch(DELETE_EMAIL());
            navigate("/shop/login")


        },
        onError: (error) => {
            console.log("error", error);
            alert("Đổi mật khẩu thất bại");
        }
    });

    const [err, setErr] = useState(null);

    // Schema validation using yup
    const schema = yup.object({
        password: yup
            .string()
            .required("Vui lòng nhập mật khẩu")
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
                "Mật khẩu phải có ít nhất 1 chữ cái hoa, 1 số, 1 ký tự đặc biệt và ít nhất 6 ký tự"
            ),
        confirmPassword: yup
            .string()
            .required("Vui lòng nhập lại mật khẩu")
            .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema),
        mode: "onSubmit",
    });


    const onError = (errors) => {
        console.log(errors);

        // Display the first error found
        if (errors.email) {
            setErr(errors.confirmPassword.message);
        } else if (errors.password) {
            setErr(errors.password.message);
        }
    };
    const onsubmit = (data) => {
        console.log(data);
        data['newPassword'] = data.password;
        data['email'] = email
        mutate(data)
    }

    return (
        <div id="login-seller">
            <div className="wrapper">
                <div className="logo">
                    <img src="https://res.cloudinary.com/dzq9ac2qd/image/upload/v1742304897/logo_xrx34y.png" alt="logo" />
                </div>
                <div className="text-center mt-4 name">Quản lý cửa hàng</div>

                <form className="p-3 mt-3" onSubmit={handleSubmit(onsubmit, onError)}>
                    {err && <Alert variant="danger">{err}</Alert>}

                    <div className="form-field d-flex align-items-center">
                        <span className="far fa-user" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu mới"
                            {...register("password")}
                        />
                    </div>

                    <div className="form-field d-flex align-items-center">
                        <span className="fas fa-key" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu mới"
                            {...register("confirmPassword")}
                        />
                    </div>

                    <button type="submit" className="btn mt-3">Đổi mật khẩu</button>
                </form>

                <div className="text-center fs-6">
                    <a href="/shop/login">Bạn đã là thành viên? Đăng nhập ngay!</a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
