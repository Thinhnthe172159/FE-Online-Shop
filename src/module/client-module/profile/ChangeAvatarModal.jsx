import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import { Modal } from "react-bootstrap";

const ChangeAvatarModal = ({ handleClose, show, postAvatar, avatar }) => {
  const [preview, setPreview] = useState(null);
  const onCrop = (preview) => {
    setPreview(preview);
  };

  const onClose = () => {
    setPreview(null);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 71680) {
      alert("File is too big!");
      elem.target.value = "";
    }
  };

  const handleUpload = () => {
    postAvatar({
      avatar: preview,
    });
  };

  return (
    <div id="change-avatar">
      <Modal  dialogClassName="change-avatar-modal" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box
            sx={{
              display: "flex",
              
            }}
          >
            <div className="preview">
              <span>Preview</span>
              <img
                width={110}
                height={110}
                src={preview ? preview : avatar}
                alt=""
              />
            </div>
            <div
              className="avatar"
              style={{
                width: "70%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Avatar
                label={"Chọn ảnh đại diện"}
                onClose={onClose}
                onCrop={onCrop}
                width={300}
              ></Avatar>
            </div>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            sx={{
              background: " #ffcf20",
              color: "#1b1b1b",
              textTransform: "capitalize",
              borderRadius: "100px",
            }}
            variant="contained"
            onClick={handleUpload}
          >
            Lưu ảnh đại diện
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChangeAvatarModal;
