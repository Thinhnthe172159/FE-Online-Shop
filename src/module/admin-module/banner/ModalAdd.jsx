import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  boxShadow: 24,
  padding: "20px",
  borderRadius: "8px",
});

const AddBannerModal = ({
  open,
  handleClose,
  handleAddBanner,
  handleUpdateBanner,
  editBanner,
}) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editBanner) {
      setDescription(editBanner.description);
    } else {
      setDescription("");
      setImage(null);
    }
  }, [editBanner]);

  const handleSubmit = () => {
    if (!editBanner && !image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("description", description);

    if (editBanner) {
      handleUpdateBanner(editBanner.id, formData);
    } else {
      handleAddBanner(formData);
    }
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <h2>{editBanner ? "Edit Banner" : "Add Banner"}</h2>
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: "16px" }}
        />
        {editBanner && (
          <img
            src={editBanner.image}
            alt="Current banner"
            style={{ maxWidth: "100%", marginBottom: "16px" }}
          />
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editBanner ? "Update" : "Add"}
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default AddBannerModal;