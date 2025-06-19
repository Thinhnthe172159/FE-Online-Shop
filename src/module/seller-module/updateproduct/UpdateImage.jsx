import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardMedia, Grid, Typography, Button, Input } from "@mui/material";
import "./ProductDetail.css";  // Import CSS file
import { fetch } from "../../../api/Fetch";

const ProductImages = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImageToUpdate, setSelectedImageToUpdate] = useState(null);  // For tracking selected image to update

  // Fetch product data
  const fetchProductData = async () => {
    try {
      const response = await fetch.get(`/product/getbyID/${id}`);
      setProductData(response.data);  // Lưu dữ liệu sản phẩm vào state
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchProductData();  // Fetch product data on initial load
  }, [id]);

  // Handle image uploads
  const handleImageChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    const totalImages = productData?.images.length + newImages.length + fileArray.length;
    if (totalImages > 5) {
      setError("You can only upload up to 5 images in total.");
      return;
    }
    setError(null);
    setNewImages((prevImages) => [...prevImages, ...fileArray]);
  };

  // Handle image removal (for new images)
  const handleImageRemove = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
  };

  // Handle image removal (for existing images)
  const handleExistingImageRemove = async (imageId) => {
    try {
      const response = await fetch.delete(`/product/remove-image/${imageId}`);
      console.log("Image removed successfully", response.data);
      fetchProductData();  // Refetch product data after removal
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  // Handle image update (replace an existing image immediately after selection)
  const handleImageUpdate = async (e) => {
    const selectedImage = e.target.files[0]; // Get the selected image

    if (!selectedImage) {
      alert("Please select an image to replace.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);  // Upload the selected image for replacement

    try {
      const response = await fetch.post(`/product/update-image/${productData.images[selectedImageToUpdate].id}`, formData);
      console.log("Image updated successfully", response.data);
      fetchProductData();  // Refetch product data after update
      setSelectedImageToUpdate(null);  // Reset selected image index
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  // Update all images (including new ones)
  const handleImageUpdateAll = async () => {
    const formData = new FormData();
    newImages.forEach((image) => formData.append("images[]", image));
    try {
      const response = await fetch.post(`/product/update-images/${id}`, formData);
      console.log("Images updated successfully", response.data);
      fetchProductData();
      setNewImages([]); // Clear new images after upload
    } catch (error) {
      console.error("Error updating images:", error);
    }
  };

  if (!productData) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <Typography variant="h4" gutterBottom>
        Cập nhật ảnh
      </Typography>

      {/* Upload button (styled as 'UPLOAD') */}
      <Grid item xs={12}>
        <label htmlFor="image-upload" className="upload-btn">
          UPLOAD
        </label>
        <Input
          id="image-upload"
          type="file"
          inputProps={{ multiple: true }}
          onChange={handleImageChange}
          style={{ display: "none" }} // Hide the actual input
        />
        {error && <Typography color="error">{error}</Typography>}
      </Grid>

      <Grid container spacing={2}>
        {/* Display existing images */}
        {productData.images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card className="product-card">
              <CardMedia
                component="img"
                height="200"
                image={image.image}
                alt={`Product Image ${index + 1}`}
                className="product-image"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Image {index + 1}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleExistingImageRemove(image.id)}
                >
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setSelectedImageToUpdate(index)}  // Set the image index to be updated
                >
                  Update
                </Button>

                {/* Conditionally render the input for selecting the new image */}
                {selectedImageToUpdate === index && (
                  <Input
                    type="file"
                    onChange={handleImageUpdate}  // Automatically update the image after selection
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Display new images to upload */}
        {newImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="product-card">
              <CardMedia
                component="img"
                height="200"
                image={URL.createObjectURL(image)} // For preview
                alt={`New Image ${index + 1}`}
                className="product-image"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  New Image {index + 1}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleImageRemove(index)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Update button for all new images */}
        {newImages.length > 0 && (
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleImageUpdateAll}>
              Update Images
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ProductImages;
