import React, { useEffect, useState } from "react";
import "./profile.scss";
import { Alert, Box, Button, Stack } from "@mui/material";
import { Col, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserDetail,
  updateDetail,
  uploadAvatar,
} from "../../../api/customerApi";
import { useSelector } from "react-redux";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeAvatarModal from "./ChangeAvatarModal";
import EditNoteIcon from "@mui/icons-material/EditNote";

const ProfileAccount = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const [error, setError] = useState(null); // Single error state for validation

  // Show avatar modal
  const [show, setShow] = useState(false);

  // Show password modal
  const [passwordShow, setPasswordShow] = useState(false);

  // Kiểm tra trạng thái login
  const login = useSelector((state) => state.auth.login);

  // Lấy data người dùng theo login
  const { data, isLoading } = useQuery({
    queryKey: ["account-detail-home"],
    queryFn: getUserDetail,
    enabled: login,
    retry: 1,
  });
  console.log(data);
  // Thay thế data
  useEffect(() => {
    if (data) {
      setFullName(data.name);
      setPhoneNumber(data.phoneNumber || ""); // Set phone number if available
    }
  }, [data]);

  // Upload avatar
  const { mutate: postAvatar } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      window.location.reload();
    },
    onError: (e) => {
      console.log(e);
    },
  });

  // Update hồ sơ
  const { mutate: postDetail } = useMutation({
    mutationFn: updateDetail,
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Đã cập nhật hồ sơ",
      });
      queryClient.refetchQueries(["account-detail-home"]);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  // Validation logic
  const validate = () => {
    if (!fullName.trim()) {
      setError("Họ và tên là bắt buộc");
      return false;
    }

    if (phoneNumber && !/^\d{10,11}$/.test(phoneNumber)) {
      setError("Số điện thoại phải là dãy số từ 10 đến 11 chữ số");
      return false;
    }

    setError(null); // Clear error if validation passes
    return true;
  };

  // Thực thi update hồ sơ
  const handleUpdate = () => {
    if (!validate()) return;

    let data = {
      name: fullName,
      phoneNumber: phoneNumber, // Include phone number if available
    };
    postDetail(data);
  };

  // Show avatar modal
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  // Show password modal
  const showPassword = () => setPasswordShow(true);
  const closeShowPassword = () => setPasswordShow(false);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id="profile-account">
      <div className="profile_account_head">
        <h3>Hồ sơ</h3>
        {error && (
          <Alert className="my-2" severity="error">
            {error}
          </Alert>
        )}
      </div>
      <div className="profile_account_bottom">
        <Stack direction={"row"} spacing={4}>
          {/* Detail */}
          <Box sx={{ width: "65%", borderRight: "1px solid #ccc" }}>
            <div className="head">
              <p>Thông tin</p>
            </div>

            <Row style={{ width: "100%" }}>
              <Col lg={3} className="mx-3">
                <div className="avatar" onClick={handleShow}>
                  <img src={data.avatar ? data.avatar : ""} alt="" />
                  <span className="edit-icon">
                    <EditNoteIcon />
                  </span>
                </div>
              </Col>

              <Col>
                <div className="detail-profile">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Họ và Tên <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        style={{ width: "100%" }}
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        style={{ width: "100%" }}
                        type="text"
                        placeholder="Nhập số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
            </Row>
          </Box>

          {/* Password */}
          <Box sx={{ width: "50%" }}>
            <Box sx={{ width: "100%" }}>
              <div className="head">
                <p>Email và mật khẩu</p>
              </div>
              <div className="changePass">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      style={{ width: "100%" }}
                      type="readonly"
                      disabled
                      value={data.email}
                    />
                  </Form.Group>
                </Form>

               
                  <Stack direction={"row"} spacing={2}>
                    <Form.Group>
                    
                      <Form.Control
                       
                        type="password"
                        readOnly
                        disabled
                        value="*******"
                      />
                    </Form.Group>

                    <Button
                      onClick={showPassword}
                      size="small"
                      sx={{
                        background: " #ffcf20",
                        color: "#1b1b1b",
                        textTransform: "capitalize",
                        borderRadius: "100px",
                      }}
                    >
                      Đổi mật khẩu
                    </Button>
                  </Stack>
             
              </div>
            </Box>
          </Box>
        </Stack>

        <Button
          onClick={handleUpdate}
          sx={{
            background: " #ffcf20",
            color: "#1b1b1b",
            textTransform: "capitalize",
            borderRadius: "100px",
          }}
        >
          Lưu thông tin
        </Button>
      </div>

      <ChangeAvatarModal
        show={show}
        handleClose={handleClose}
        postAvatar={postAvatar}
        avatar={data.avatar}
      ></ChangeAvatarModal>
      <ChangePasswordModal
        show={passwordShow}
        close={closeShowPassword}
      ></ChangePasswordModal>
    </div>
  );
};

export default ProfileAccount;
