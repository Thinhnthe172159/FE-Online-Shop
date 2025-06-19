import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import "./order.scss";
import { Button, Stack, Typography, Alert, Snackbar } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { saveCancel } from "../../../api/orderCancelApi";
import Swal from "sweetalert2";

const CancelOrder = ({ show, handleClose, data }) => {
  const [reason, setReason] = useState(""); // State lưu lý do hủy đơn
  const [images, setImages] = useState([]); // State lưu danh sách ảnh đã thêm
  const [openAlert, setOpenAlert] = useState(false); // State để hiển thị cảnh báo

  // Xử lý thay đổi lý do hủy đơn
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  // Xử lý thêm ảnh
  const handleAddImage = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(), // Tạo ID duy nhất dựa trên thời gian hiện tại và số ngẫu nhiên
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const {mutate} = useMutation({
    mutationFn:(data) =>  saveCancel(data),
    onSuccess: () =>{
        setImages([])
        setReason("")
        handleClose()
        Swal.fire({
            icon:"success",
            text:"Chúng tôi sẽ sớm xử lý yêu cầu của bạn"
        })

    },
    onError: () =>{
        Swal.fire({
            icon:"error",
            text:"Vui lòng thử lại sau"
        })
    }
  })

  // Xử lý gửi form
  const handleSubmit = () => {
    // Kiểm tra lý do hủy đơn
    if (!reason.trim()) {
      setOpenAlert(true); // Mở thông báo cảnh báo nếu không có lý do
      return;
    }

    let formData = new FormData();
    let content = {
        order_id : data.id,
        reason
    }
    formData.append("reason",JSON.stringify(content))

    // Lặp qua danh sách ảnh và thêm từng ảnh vào formData
    images.forEach((image, index) => {
        formData.append("images", image.file); // Sử dụng image.file để thêm đúng tệp ảnh
      });
    console.log(formData);
    

    mutate(formData)

    // Gửi formData qua API (ví dụ)
    // fetch("/api/cancel-order", {
    //   method: "POST",
    //   body: formData,
    // }).then(response => handleClose()); // Xử lý sau khi gửi dữ liệu thành công
  };

  return (
    <Modal dialogClassName="change-avatar-modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Yêu cầu hủy đơn {data.code}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {openAlert && <Alert className="my-3" severity="error">Vui lòng nhập lý do</Alert>}
        <Stack direction={"column"}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Vui lòng nhập lý do hủy đơn (thêm ảnh nếu có):</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={reason} 
              onChange={handleReasonChange} 
            />
          </Form.Group>
          
          <Stack direction="row" justifyContent="center" spacing={2} alignItems="center">
            <Button 
              variant="contained" 
              component="label"
              sx={{ textTransform: "initial" }}
            >
              + Thêm ảnh
              <input 
                type="file" 
                hidden 
                multiple 
                accept="image/*" 
                onChange={handleAddImage} 
              />
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} mt={2} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
            {images.map((image) => (
              <div key={image.id} style={{ position: "relative", margin: "10px" }}>
                <img 
                  src={image.url} 
                  alt="Preview" 
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                />
                <Button 
                  size="small" 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleRemoveImage(image.id)}
                  sx={{ position: "absolute", top: "-5px", right: "-5px", minWidth: "24px", padding: "4px" }}
                >
                  x
                </Button>
              </div>
            ))}
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant="secondary">Hủy</Button>
        <Button onClick={handleSubmit} variant="primary">Lưu thay đổi</Button>
      </Modal.Footer>

     
    </Modal>
  );
};

export default CancelOrder;
