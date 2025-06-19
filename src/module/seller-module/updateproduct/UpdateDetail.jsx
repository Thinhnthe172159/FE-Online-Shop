import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { fetch } from "../../../api/Fetch";
import { useNavigate, useParams } from "react-router-dom";

const UpdateDetail = () => {
  const inputFileRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [rawPrice, setRawPrice] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    width: "",
    length: "",
    height: "",
    weight: "",
    description: "",
    avatar: null,
  });

  const [message, setMessage] = useState(null);
  const [product, setProduct] = useState(null);
  const formatCurrency = (value) => {
    // Loại bỏ tất cả ký tự không phải số để xử lý
    const numericValue = value.replace(/\D/g, "");
    // Thêm dấu chấm vào hàng nghìn
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch.get(`/product/getbyID/${id}`);
        console.log("API Response:", response.data); // Log the response to check its structure
        const productData = response.data;

        // Initialize formData with the correct property names from the API response
        setFormData({
          name: productData.name || '',
          price:productData.price ? formatCurrency(productData.price.toString()) : '',
          width: productData.width || '',
          length: productData.length || '',
          height: productData.height || '',
          weight: productData.weight || '',
          description: productData.description || '',
          avatar: null, // This will be set on file upload
        });
        setProduct(productData); // Save product data for later use
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "price") {
      // Loại bỏ các ký tự không phải số và cập nhật `rawPrice`
      const numericValue = value.replace(/\D/g, "");
      setRawPrice(numericValue); // Giữ nguyên số để gửi
  
      // Định dạng giá trị để hiển thị
      const formattedValue = formatCurrency(numericValue);
      setFormData((prevData) => ({
        ...prevData,
        price: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: e.target.files[0],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append(
      "product",
      JSON.stringify({
        name: formData.name,
        id: id,
        price: rawPrice, // Gửi `rawPrice` không định dạng
        width: formData.width,
        length: formData.length,
        height: formData.height,
        weight: formData.weight,
        description: formData.description,
      })
    );
  
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }
  
    try {
      const data = await fetch.put("/product/update", formDataToSend);
      console.log(data);
      setMessage({ type: "success", text: "Product updated successfully!" });
      navigate(`/seller/product`);
    } catch (error) {
      console.error("Error during update:", error);
      setMessage({
        type: "error",
        text: error.message || "An error occurred while updating the product.",
      });
    }
  };

  return (
    <Container
      id="seller-product"
      className="mt-4 mb-5"
      style={{ width: "70%" }}
    >
      <form onSubmit={handleUpdate}>
        <div className="form-header">
          <h3>Cập nhật sản phẩm</h3>
        </div>

        {message && (
          <Alert severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <div className="form-body">
          <div className="body-info">
            <Stack
              sx={{ justifyContent: "space-between" }}
              className="mt-3"
              direction="row"
              spacing={3}
            >
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Tên sản phẩm <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    name="name"
                    sx={{ width: "100%" }}
                    label="Tên sản phẩm"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Giá sản phẩm <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    name="price"
                    sx={{ width: "100%" }}
                    label="Giá sản phẩm"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </Stack>
          </div>

          <div className="body-specifications">
            <Stack
              sx={{ justifyContent: "space-between" }}
              className="mt-3"
              direction="row"
              spacing={3}
            >
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Chiều rộng(cm) <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Chiều rộng"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Chiều dài(cm) <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    name="length"
                    sx={{ width: "100%" }}
                    label="Chiều dài"
                    value={formData.length}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </Stack>
          </div>

          <div className="body-specifications">
            <Stack
              sx={{ justifyContent: "space-between" }}
              className="mt-3"
              direction="row"
              spacing={3}
            >
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Chiều cao(cm) <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    name="height"
                    sx={{ width: "100%" }}
                    label="Chiều cao"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </Box>
              </div>
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Trọng lượng (g) <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    name="weight"
                    sx={{ width: "100%" }}
                    label="Trọng lượng"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </Box>
              </div>
            </Stack>
          </div>

          <div className="body-avatar">
            <Box
              className="mt-5 mb-3"
              sx={{ justifyContent: "space-between", display: "flex" }}
            >
              <h6>
                <i>Ảnh đại diện của sản phẩm</i> :
              </h6>
            </Box>
            <Stack>
              {/* Input file ẩn */}
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef} // Gán tham chiếu cho input
                style={{ display: "none" }} // Ẩn input file
                onChange={handleFileChange}
              />

              {/* Hình ảnh hiển thị và nhấn vào để mở input file */}
              <div className="mx-4 add-image">
                <img
                  width={250}
                  height={300}
                  style={{ border: "dashed 1px black", cursor: "pointer" }}
                  src={
                    formData.avatar
                      ? URL.createObjectURL(formData.avatar)
                      : product?.avatar ||
                        "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg"
                  }
                  alt="Upload Avatar"
                  onClick={() => inputFileRef.current.click()} // Kích hoạt input file khi nhấn vào ảnh
                />
              </div>
            </Stack>
          </div>

          <div className="body-desc">
            <Box
              className="mt-5 mb-3"
              sx={{ justifyContent: "space-between", display: "flex" }}
            >
              <h6>
                <i>Giới thiệu về sản phẩm</i> :
              </h6>
            </Box>
            <Stack>
              <Editor
                id="description"
                apiKey="nzyv83pf6j7byh0gpj2588pjvd3r415xwispf0zt20z4h5s5"
                init={{
                  height: 700,
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                value={formData.description}
                onEditorChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
              />
            </Stack>
          </div>

          <Stack
            className="mt-4"
            direction={"row"}
            spacing={3}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="contained">
              Cập nhật thông tin
            </Button>
          </Stack>
        </div>
      </form>
    </Container>
  );
};

export default UpdateDetail;
