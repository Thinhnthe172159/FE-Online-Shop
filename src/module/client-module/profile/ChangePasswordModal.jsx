import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import Modal from "react-bootstrap/Modal";
import "./profile.scss";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "react-bootstrap";
import { Alert, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../../api/customerApi";
import Swal from "sweetalert2";

const ChangePasswordModal = ({ show, close }) => {
  let [err, setErr] = useState(null);
  let { mutate } = useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      setErr(null);
      Swal.fire({
        icon: "success",
        title: "Mật khẩu đã thay đổi",
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      }).then((result) => {
        if (result.isConfirmed) {
          reset();
          close();
        }
      });
    },
    onError: (e) => {
      if (e.response != null) {
        setErr(e.response.data.message);
      }
    },
  });

  let formdata = [
    {
      name: "oldPassword",
      label: "Nhập mật khẩu cũ",
    },
    {
      name: "password",
      label: "Nhập mật khẩu mới",
    },
    {
      name: "confirmPassword",
      label: "Xác nhận mật khẩu mới",
    },
  ];

  let schema = yup.object({
    oldPassword: yup
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/,
        "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường và một số"
      ),
    password: yup
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/,
        "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường và một số"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Xác nhận mật khẩu không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const submitPassword = (data) => {
    mutate(data);
  };

  let {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  return (
    <Modal dialogClassName="change-password-modal" show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submitPassword)}>
        {err != null ? (
          <Alert className="my-3" severity="error">
            {err}
          </Alert>
        ) : (
          ""
        )}
        <Modal.Body>
          {formdata.map((item) => {
            return (
              <Form.Group className="mb-3" id="form-password">
                <Form.Label>
                  {item.label} <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  className="custom-input"
                  type="password"
                  name={item.name}
                  placeholder={item.label}
                  isInvalid={Boolean(errors[item.name])}
                  {...register(item.name)}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            sx={{ textTransform: "capitalize" }}
            variant="secondary"
            onClick={close}
          >
            Hủy
          </Button>
          <Button
            sx={{
              background: " #ffcf20",
              color: "#1b1b1b",
              textTransform: "capitalize",
              borderRadius: "100px",
            }}
            variant="outlined"
            type="submit"
          >
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
