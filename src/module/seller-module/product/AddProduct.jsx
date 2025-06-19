import React, { useRef, useState } from "react";
import { Container, Form, InputGroup, TabPane } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import "./productmodal.scss";
import { fetch } from "../../../api/Fetch";
import TextField from "@mui/material/TextField";
import { Alert, Box, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SelectCategory from "./SelectCategory";

const AddProduct = () => {
  const [productImages, setProductImages] = useState([
    "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg",
    "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg",
    "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg",
    "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg",
  ]);

  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(
    "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg"
  );

  const [selectCategory, setSelectCategory] = useState([]);

  const handleAddImage = () => {
    setProductImages([
      ...productImages,
      "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg",
    ]);
  };

  const handleProductImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...productImages];
      updatedImages[index] = URL.createObjectURL(file); // Thay thế ảnh tại vị trí được chọn
      setProductImages(updatedImages); // Cập nhật mảng productImages với ảnh mới
    }
  };
  const inputFileRefs = useRef([]);
  const handleSelectCategory = (e) => {
    setSelectCategory([...e]);
  };

  const inputFileRef = useRef();
  const addAvatar = () => {
    inputFileRef.current.click();
  };

  const [err, setErr] = useState(null);

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    avatar: null,
    width: "",
    length: "",
    height: "",
    weight: "",
    priceView: "",
  });
  const [optionData, setOptionData] = useState([{ name: "", quantity: "" }]);
  const [addOn, setAddOn] = useState([]);

  const handleAddOption = () => {
    setOptionData([...optionData, { name: "", quantity: "" }]);
  };

  const handleChangeOption = (index, field, value) => {
    const newOptionData = optionData.map((option, i) => {
      return i == index ? { ...option, [field]: value } : option;
    });
    setOptionData(newOptionData);
  };

  const handleDeleteOption = (index) => {
    if (optionData.length == 1) {
      return;
    }
    const newOptionData = optionData.filter((item, i) => i != index);
    setOptionData(newOptionData);
  };

  const handleAddAddOn = () => {
    setAddOn([...addOn, { name: "", price: "", previewPrice: "" }]);
  };

  const handleChangeAddOn = (index, field, value) => {
    const newAddOn = addOn.map((item, i) => {
      if (i === index) {
        if (field === "previewPrice") {
          // Remove any non-numeric characters and format previewPrice
          const rawValue = value.replace(/\D/g, "");
          item.previewPrice = formatCurrency(rawValue);
          item.price = parseInt(rawValue) || 0; // Set price as an integer
        } else {
          item[field] = value;
        }
      }
      return item;
    });
    setAddOn(newAddOn);
  };

  const handleDeleteAddOn = (index) => {
    const newAddon = addOn.filter((item, i) => i != index);
    setAddOn(newAddon);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // Thiết lập URL preview
      setProductData({ ...productData, avatar: file });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      let updateProduct = { ...productData };
      // Loại bỏ tất cả dấu chấm hiện tại
      let rawValue = value.replace(/\./g, "");
      if (isNumeric(rawValue)) {
        (updateProduct.price = rawValue),
          (updateProduct.priceView = formatCurrency(rawValue));
      } else {
        (updateProduct.price = ""), (updateProduct.priceView = "");
      }
      setProductData(updateProduct);
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu chấm phân cách hàng ngàn
  };

  const isNumeric = (value) => {
    const regex = /^\d+$/; // Kiểm tra chỉ cho phép các ký tự số
    return regex.test(value);
  };

  const handleEditorChange = (content, editor) => {
    setProductData({ ...productData, [editor.id]: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasError = validate();

    if (hasError) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    // // Filter add-ons
    // let dataAddon = addOn.filter(
    //   (item) => item.name !== "" && item.price !== ""
    // );

    const formData = new FormData();
    const categoryArr = selectCategory.map((item) => ({
      id: item.value, // Đổi 'value' thành 'id'
      name: item.label, // Đổi 'label' thành 'name'
    }));
    let { priceView, avatar, ...datanew } = productData;
    let ob = {
      ...datanew,
      addOns: addOn.map(({ name, price }) => ({ name, price })), // Only send name and price
      options: optionData,
      categories: categoryArr,
    };

    formData.append("product", JSON.stringify(ob));
    if (avatar) {
      formData.append("avatar", avatar);
    }
    console.log("avatar:", formData.getAll("images[]"));
    // thay đổi ở đây
    //add them images
    const placeholderImage =
      "https://cdn-app.kiotviet.vn/retailler/Content/img/default-product-img.jpg";
    productImages.map(async (imageUrl) => {
      if (imageUrl !== placeholderImage) {
        formData.append("images[]", imageUrl);
      }
    });
    console.log("Images:", formData.getAll("images[]"));
    try {
      const response = await fetch.post("/product/add", formData);
      console.log("Product added successfully:", response.data);
      navigate("/seller/product");
    } catch (error) {
      if (error.response) {
        console.error("Error adding product:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const validate = () => {
    const errors = [];

    if (productData.name === "") {
      errors.push("Vui lòng nhập tên sản phẩm");
    }
    if (productData.price === "") {
      errors.push("Vui lòng nhập giá sản phẩm");
    }
    if (productData.description === "") {
      errors.push("Vui lòng nhập mô tả sản phẩm");
    }

    // Kiểm tra trường width
    if (productData.width === "") {
      errors.push("Vui lòng nhập chiều rộng của sản phẩm");
    } else if (isNaN(productData.width) || parseFloat(productData.width) <= 0) {
      errors.push("Chiều rộng phải là số hợp lệ");
    }

    // Kiểm tra trường length
    if (productData.length === "") {
      errors.push("Vui lòng nhập chiều dài của sản phẩm");
    } else if (
      isNaN(productData.length) ||
      parseFloat(productData.length) <= 0
    ) {
      errors.push("Chiều dài phải là số hợp lệ");
    }

    // Kiểm tra trường height
    if (productData.height === "") {
      errors.push("Vui lòng nhập chiều cao của sản phẩm");
    } else if (
      isNaN(productData.height) ||
      parseFloat(productData.height) <= 0
    ) {
      errors.push("Chiều cao phải là số hợp lệ");
    }

    // Kiểm tra trường weight
    if (productData.weight === "") {
      errors.push("Vui lòng nhập trọng lượng của sản phẩm");
    } else if (
      isNaN(productData.weight) ||
      parseFloat(productData.weight) <= 0
    ) {
      errors.push("Trọng lượng phải là số hợp lệ");
    }

    optionData.forEach((option, index) => {
      if (option.name === "") {
        errors.push(`Vui lòng nhập tên lựa chọn cho tùy chọn ${index + 1}`);
      }
      if (option.quantity === "") {
        errors.push(`Vui lòng nhập số lượng cho tùy chọn ${index + 1}`);
      }
    });

    // Cập nhật err nếu có lỗi
    if (errors.length > 0) {
      setErr(errors[0]); // Chỉ lấy thông báo lỗi đầu tiên
      return true; // Có lỗi
    } else {
      setErr(null); // Đặt lại lỗi nếu không có lỗi
      return false; // Không có lỗi
    }
  };

  return (
    <Container
      id="seller-product"
      className="mt-4 mb-5"
      style={{ width: "70%" }}
    >
      <form onSubmit={handleSubmit} action="">
        <div className="form-header">
          <h3>Thêm sản phẩm</h3>
        </div>
        {err != null ? (
          <div className=" my-3">
            <Alert severity="error">{err}</Alert>
          </div>
        ) : (
          ""
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
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    label="Tên sản phẩm"
                    value={productData.name}
                  />
                </Box>
              </div>
              <div style={{ width: "50%" }}>
                <Box>
                  <label htmlFor="" className="mb-3">
                    Giá sản phẩm (Vnd) <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    name="price"
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    label="Giá sản phẩm (vnd)"
                    value={productData.priceView}
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
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    label="Chiều rộng"
                    name="width"
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
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    label="Chiều dài"
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
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    label="Chiều cao"
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
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    label="Trọng lượng"
                  />
                </Box>
              </div>
            </Stack>
          </div>
          <div className="div">
            <Box>
              <label htmlFor="" className="mb-3 mt-3">
                Lựa chọn loại mặt hàng <span style={{ color: "red" }}>*</span> :
              </label>
              <SelectCategory
                selectCategory={selectCategory}
                handleSelectCategory={handleSelectCategory}
              ></SelectCategory>
            </Box>
          </div>
          <div className="body-option">
            <Box
              className="mt-5 mb-3"
              sx={{ justifyContent: "space-between", display: "flex" }}
            >
              <h6>
                <i>
                  Thêm tùy chọn <span style={{ color: "red" }}>*</span>
                </i>{" "}
                :
              </h6>
              <Button
                onClick={handleAddOption}
                sx={{ textTransform: "capitalize" }}
                variant="outlined"
              >
                + Thêm mới tùy chọn
              </Button>
            </Box>
            <Stack>
              {optionData.map((item, index) => {
                return (
                  <Stack className="mb-3" direction={"row"} spacing={3}>
                    <Stack
                      direction={"row"}
                      sx={{ width: "50%", alignItems: "center" }}
                      spacing={2}
                    >
                      <label htmlFor="">
                        Tên tùy chọn <span style={{ color: "red" }}>*</span> :{" "}
                      </label>
                      <TextField
                        variant="standard"
                        sx={{ width: "70%" }}
                        label="Tên lựa chọn"
                        value={item.name}
                        onChange={(e) =>
                          handleChangeOption(index, "name", e.target.value)
                        }
                      />
                    </Stack>

                    <Stack
                      direction={"row"}
                      sx={{ width: "50%", alignItems: "center" }}
                      spacing={2}
                    >
                      <label htmlFor="">
                        Số lượng <span style={{ color: "red" }}>*</span> :
                      </label>
                      <TextField
                        name={item.quantity}
                        onChange={(e) =>
                          handleChangeOption(index, "quantity", e.target.value)
                        }
                        variant="standard"
                        sx={{ width: "70%" }}
                        label="Số lượng"
                      />
                    </Stack>

                    <Button
                      onClick={() => handleDeleteOption(index)}
                      variant="outlined"
                      color="error"
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          </div>
          <div className="body-addon">
            <Box
              className="mt-5 mb-3"
              sx={{ justifyContent: "space-between", display: "flex" }}
            >
              <h6>
                <i>Các tính năng bổ sung</i> :
              </h6>
              <Button
                onClick={handleAddAddOn}
                sx={{ textTransform: "capitalize" }}
                variant="outlined"
              >
                + Thêm mới các tính năng bổ sung
              </Button>
            </Box>

            {addOn.map((item, index) => {
              return (
                <Stack key={index}>
                  <Stack className="mb-3" direction={"row"} spacing={3}>
                    <Stack
                      direction={"row"}
                      sx={{ width: "50%", alignItems: "center" }}
                      spacing={2}
                    >
                      <label htmlFor="">Tên chức năng :</label>
                      <TextField
                        variant="standard"
                        sx={{ width: "70%" }}
                        label="Tên lựa chọn"
                        name={`name-${index}`} // Ensure unique name
                        value={item.name}
                        onChange={(e) =>
                          handleChangeAddOn(index, "name", e.target.value)
                        }
                      />
                    </Stack>

                    <Stack
                      direction={"row"}
                      sx={{ width: "50%", alignItems: "center" }}
                      spacing={2}
                    >
                      <label htmlFor="">Giá tiền (Vnd) :</label>
                      <TextField
                        variant="standard"
                        sx={{ width: "70%" }}
                        label="Giá tiền"
                        name={`previewPrice-${index}`} // Ensure unique name
                        value={item.previewPrice} // Display formatted previewPrice
                        onChange={
                          (e) =>
                            handleChangeAddOn(
                              index,
                              "previewPrice",
                              e.target.value
                            ) // Update previewPrice
                        }
                      />
                    </Stack>

                    <Button
                      onClick={() => handleDeleteAddOn(index)}
                      variant="outlined"
                      color="error"
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                </Stack>
              );
            })}
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
              <div className="mx-4 add-image">
                <img
                  onClick={addAvatar}
                  width={250}
                  height={300}
                  style={{ border: "dashed 1px black", cursor: "pointer" }}
                  src={avatarPreview} // Sử dụng avatarPreview làm nguồn ảnh
                  alt="Product Avatar Preview"
                />

                <input
                  ref={inputFileRef}
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </Stack>
          </div>

          <div className="body-images">
            <Stack
              direction={"row"}
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Box
                className="mt-5"
                sx={{ justifyContent: "space-between", display: "flex" }}
              >
                <h6>
                  <i>Ảnh sản phẩm</i> :
                </h6>
              </Box>
              <Button variant="outlined" onClick={handleAddImage}>
                + Thêm ảnh
              </Button>
            </Stack>

            {/* Displaying product image slots */}
            <Stack
              direction="row"
              spacing={2}
              className="mx-4 my-4 add-image"
              sx={{ flexWrap: "wrap", justifyContent: "space-" }}
            >
              {productImages.map((image, index) => (
                <div key={index}>
                  <img
                    width={220}
                    height={250}
                    style={{ border: "dashed 1px black", cursor: "pointer" }}
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    onClick={() => inputFileRefs.current[index].click()} // Mở input file tương ứng khi click vào ảnh
                  />
                  <input
                    ref={(el) => (inputFileRefs.current[index] = el)} // Lưu tham chiếu đến từng input file
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProductImageChange(e, index)} // Xử lý thay đổi ảnh
                  />
                </div>
              ))}
            </Stack>
          </div>
          <div className="body-desc">
            <Box
              className=" mb-3"
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
                onEditorChange={handleEditorChange}
              />
            </Stack>
          </div>
          <Stack
            className="mt-4"
            direction={"row"}
            spacing={3}
            sx={{ justifyContent: "end" }}
          >
            <Button variant="outlined">hủy</Button>
            <Button type="submit" variant="contained">
              Thêm sản phẩm
            </Button>
          </Stack>
        </div>
      </form>
    </Container>
  );
};

export default AddProduct;
