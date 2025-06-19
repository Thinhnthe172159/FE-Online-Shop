import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff, Edit } from "@mui/icons-material";
import "./profile.scss";
import { fetch } from "../../../api/Fetch";

const SellerProfileAccount = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleOpenPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const data = await fetch.get("/shopOwner/get");
        setProfileData(data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        
        setError(err);
        setLoading(false);
      }
    };

    getProfileData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile data: {error.message}</p>;

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
        alert('Mật khẩu mới phải có ít nhất 8 ký tự và có ít nhất một chữ cái viết hoa.');
        return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        alert('Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt.');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert('Mật khẩu mới và xác nhận không khớp.');
        return;
    }
    try {
        const response = await fetch.post('/shopOwner/password', {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword
        });
        alert(response.data.message);
        handleClosePasswordModal(); 
    } catch (error) {
      console.log(error);
      
        if (error.response) {
            alert(error.response.data.message); 
        } else {
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    }
};

  return (
    <div id="seller-profile-account" className="mt-3">
      <Container style={{ width: "80%", display: "flex" }}>
        <Col>
          <div className="profile_account_head">
            <h3>Hồ sơ người sở hữu</h3>
          </div>

          <div className="profile_account_bottom mt-5">
            <Row>
              <Col md={6} className="border-end">
                <div className="head mb-4">
                  <p>Thông tin</p>
                </div>

                <Row>
                  <Col lg={3}>
                    <div className="avatar mb-4">
                      <img src={profileData.data.avatar} alt="Avatar" />
                      <span className="edit-icon">
                        <EditNoteIcon />
                      </span>
                    </div>
                  </Col>

                  <Col lg={9}>
                    <Form>
                      <Form.Group className="mb-4">
                        <Form.Label>Họ và Tên *</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.data.name}
                          readOnly
                          style={{ fontSize: "1rem", padding: "0.75rem" }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.data.phone}
                          readOnly
                          style={{ fontSize: "1rem", padding: "0.75rem" }}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
              </Col>

              <Col md={6} className="d-flex flex-column justify-content-center">
                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileData.data.email}
                      readOnly
                      style={{ fontSize: "1rem", padding: "0.75rem" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>
                    <TextField
                      type="password"
                      value="••••••••"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        sx: { borderRadius: "25px", paddingRight: "8px", border:"none" },
                        style: { fontSize: "1rem", padding: "0.75rem" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant="text"
                              onClick={handleOpenPasswordModal}
                              style={{ textDecoration: "none", color: "#007bff" }}
                              startIcon={<Edit />}
                            >
                              Thay đổi
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "25px",
                          paddingRight: "4px",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "black",
                        },
                        border:"none"
                      }}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>
        <Dialog open={showPasswordModal} onClose={handleClosePasswordModal}>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              label="Mật khẩu cũ"
              type={showOldPassword ? "text" : "password"}
              fullWidth
              
              placeholder="Mật khẩu cũ"
              onChange={(e) => setOldPassword(e.target.value)} // Cập nhật mật khẩu cũ
              InputProps={{
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                //       {showOldPassword ? <VisibilityOff /> : <Visibility />}
                //     </IconButton>
                //   </InputAdornment>
                // ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mật khẩu mới"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              placeholder="Mật khẩu mới"
              onChange={(e) => setNewPassword(e.target.value)} 
              InputProps={{
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                //       {showNewPassword ? <VisibilityOff /> : <Visibility />}
                //     </IconButton>
                //   </InputAdornment>
                // ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              placeholder="Xác nhận mật khẩu"
              onChange={(e) => setConfirmNewPassword(e.target.value)} // Cập nhật xác nhận mật khẩu mới
              InputProps={{
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <IconButton
                //       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                //     >
                //       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                //     </IconButton>
                //   </InputAdornment>
                // ),
              }}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="warning"
              onClick={handleChangePassword}
              fullWidth
              sx={{
                bgcolor: "#FFD700",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default SellerProfileAccount;
