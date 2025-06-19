import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetch } from "../../../api/Fetch";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ProductReview = () => {
  const [ratings, setRatings] = useState([""]);
  const [comments, setComments] = useState([""]);
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const {id} = useParams()
  useEffect(() => {
    fetch
      .get(`/order/get-order-feedback/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setProduct(response.data);
        } else {
          console.error("Failed to fetch product");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, []);
  console.log(product);
  
  const handleRatingChange = (index, value) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = value;
    setRatings(updatedRatings);
  };

  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    setComments(updatedComments);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageTypes = ["image/jpeg", "image/png"];
    const validImages = selectedFiles.filter((file) =>
      imageTypes.includes(file.type)
    );

    if (validImages.length !== selectedFiles.length) {
      setSnackbarMessage(
        "Sai định dạng ảnh, vui lòng chọn lại ảnh (chỉ hỗ trợ JPG hoặc PNG)"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setImages((prevImages) => [...prevImages, ...validImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    if (ratings[0] === "" || comments[0] === "") {
      setSnackbarMessage("Bạn phải chọn đánh giá và nhập bình luận.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    
    const feedback = {
      rating: ratings[0],
      comment: comments[0],
      productId: product.data.product.id,
    };

    formData.append("feedback", JSON.stringify(feedback));
    images.forEach((image) => {
      formData.append("images", image);
    });

    fetch
      .post(`/feedback/add/${product.data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSnackbarMessage("Đánh giá đã được gửi thành công!");
          setSnackbarSeverity("success");
          setIsSubmitted(true);
          setImages([]); // Clear images after submission
        } else {
          setSnackbarMessage("Có lỗi xảy ra khi gửi đánh giá");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
        navigate("/profile/product-feedback")
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbarMessage("Có lỗi xảy ra khi gửi feedback");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const chipLabels = [
    "Chất lượng sản phẩm tuyệt vời",
    "Đóng gói sản phẩm rất đẹp và chắc chắn",
    "Shop phục vụ rất tốt",
    "Rất đáng tiền",
  ];

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Đánh Giá Sản Phẩm
      </Typography>

      {product && (
        <Box
          sx={{
            display: "flex",
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Container>
            <Stack direction={"row"}>
              <Avatar
                src={product.data.product.avatar}
                sx={{
                  width: 150,
                  height: 150,
                  marginRight: 2,
                  objectFit: "cover",
                  borderRadius: "0",
                }}
              />
              <Box>
                <Typography variant="h6">{product.data.product.name}</Typography>
              </Box>
            </Stack>
          </Container>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        {ratings.map((rating, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Rating
              name={`rating-${index}`}
              value={parseInt(rating, 10)}
              onChange={(e, newValue) => handleRatingChange(index, newValue)}
              precision={0.5}
              max={5}
              sx={{
                fontSize: "2rem",
                display: "flex",
                justifyContent: "center",
                marginBottom: 2,
              }}
              disabled={isSubmitted}
            />
            <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
              {chipLabels.map((label, i) => (
                <Chip
                  key={i}
                  label={label}
                  onClick={() => handleCommentChange(index, label)}
                  disabled={isSubmitted}
                />
              ))}
            </Stack>
            <TextField
              label="Bình luận"
              fullWidth
              multiline
              minRows={3}
              value={comments[index] || ""}
              onChange={(e) => handleCommentChange(index, e.target.value)}
              sx={{ marginTop: 2 }}
              disabled={isSubmitted}
            />
          </Box>
        ))}

        <Stack spacing={2} sx={{ marginBottom: 2, alignItems: "center" }}>
          <Button sx={{textTransform:"initial"}} variant="contained" component="label" disabled={isSubmitted}>
            Bạn có thể thêm ảnh đánh giá tại đây
            <input hidden multiple type="file" onChange={handleImageChange} />
          </Button>

          {/* Hiển thị các ảnh xem trước */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginTop: 2 }}>
            {images.map((image, index) => (
              <Box key={index} sx={{ position: "relative" }}>
                <Avatar
                  src={URL.createObjectURL(image)}
                  sx={{ width: 80, height: 80 }}
                  variant="square"
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "white",
                  }}
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSubmitted}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitted}
          >
            Gửi đánh giá
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductReview;
