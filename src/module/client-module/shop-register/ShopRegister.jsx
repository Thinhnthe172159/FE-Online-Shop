import React, { useState } from "react";
import "./shopregister.scss";
import { Container, Form } from "react-bootstrap";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { postShopRegister } from "../../../api/shopRegisterApi";

const ShopRegister = () => {
  let formData = [
    {
      name: "name",
      label: "Họ tên người đại diện cửa hàng",
    },
    {
      name: "taxNumber",
      label: "Mã số thuế",
    },
    {
      name: "phone",
      label: "Số điện thoại liên hệ",
    },
    {
      name: "address",
      label: "Địa chỉ cửa hàng",
    },
  ];

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên người đại diện cửa hàng"),
    taxNumber: yup
      .string()
      .matches(/^\d{10}|\d{14}$/, "Mã số thuế phải có 10 hoặc 14 ký tự số")
      .required("Vui lòng nhập mã số thuế"),
    phone: yup
      .string()
      .matches(/^(0[1-9]{1}[0-9]{8}|[0-9]{10})$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
    address: yup.string().required("Vui lòng nhập địa chỉ cửa hàng"),
    desc: yup.string().required("Vui lòng nhập mô tả cửa hàng"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      taxNumber: "",
      phone: "",
      address: "",
      desc: "",
    },
  });

  const [isOnline, setIsOnline] = useState("0");
  const [images, setImages] = useState([]);

  const submitForm = (data) => {
    console.log(data); // Log dữ liệu để kiểm tra
    console.log("Images:", images); // Log hình ảnh đã chọn
    reset(); // Reset form sau khi gửi
    setImages([]); // Reset hình ảnh sau khi gửi
    data["isOnline"] = isOnline;
    let formData = new FormData();
    formData.append("form", JSON.stringify(data)); // Chuyển đổi dữ liệu form thành JSON
    images.forEach((image) => {
      formData.append("images", image); // Thêm từng hình ảnh vào FormData
    });

    mutate(formData);
  };

  const { mutate } = useMutation({
    mutationFn: (data) => postShopRegister(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        text: "Yêu cầu đã được gửi",
      });
    },
    onError: (e) => {
      console.log(e);
      Swal.fire({
        icon: "error",
        text: "Thất bại",
      });
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Lấy các tệp hình ảnh
    setImages((prevImages) => prevImages.concat(files)); // Lưu các tệp vào mảng images
  };

  const removeImage = (image) => {
    setImages(images.filter((img) => img !== image)); // Xóa hình ảnh khỏi mảng
  };

  return (
    <div id="shop-register">

      <div className="shop-register-body">
        <h5>Bạn muốn mở gian hàng trên 6MEMs?</h5>
        <ul>
          <li>
            Xin chào! Chúng mình là 6MEMs - trang thương mại điện tử tại Việt Nam
            chuyên sản phẩm thủ công độc đáo, đậm chất riêng, giàu chất Việt và
            không kém phần chất lượng từ mọi miền của Tổ quốc và 6MEMs rất hào
            hứng được đồng hành cùng bạn!
          </li>
          <li>
            <b>Đăng ký Gian hàng</b> 6MEMs hoàn toàn miễn phí. Để đăng ký gian
            hàng trên 6MEMs, vui lòng điền thông tin vào biểu mẫu bên dưới. 6MEMs
            sẽ thông báo kết quả và gửi về mail cho các bạn sau vài ngày làm
            việc.
          </li>
        </ul>

        <Container className="mt-5" style={{ width: "80%" }}>
          <Form onSubmit={handleSubmit(submitForm)}>
            <h5 className="my-5" style={{ textAlign: "center" }}>
              Form đăng ký bán hàng
            </h5>

            {formData.map((item) => (
              <Box className="my-5" key={item.name}>
                <Stack>
                  <label htmlFor={item.name} className="mb-3">
                    {item.label} <span style={{ color: "red" }}>*</span> :
                  </label>
                  <TextField
                    {...register(item.name)}
                    error={Boolean(errors[item.name])}
                    helperText={errors[item.name]?.message}
                    name={item.name}
                    sx={{ width: "100%", marginLeft: "20px" }}
                    variant="standard"
                    label="Câu trả lời của bạn"
                  />
                </Stack>
              </Box>
            ))}

            {/* Trường mô tả cửa hàng */}
            <Box className="my-5">
              <Stack>
                <label className="mb-3">
                  Mô tả cửa hàng <span style={{ color: "red" }}>*</span> :
                </label>
                <TextField
                  name="desc"
                  {...register("desc")}
                  error={Boolean(errors.desc)}
                  helperText={errors.desc?.message}
                  multiline
                  minRows={4} // Chiều cao tối thiểu
                  maxRows={6} // Chiều cao tối đa
                  sx={{ width: "100%", marginLeft: "20px" }}
                  variant="standard"
                  label="Câu trả lời của bạn"
                />
              </Stack>
            </Box>

            {/* Thêm ảnh */}
            <Box className="my-5">
              <Stack>
                <label className="mb-3">
                  Vui lòng cung cấp ảnh về cửa hàng, sản phẩm và giấy phép kinh
                  doanh nếu có <span style={{ color: "red" }}>*</span> :
                </label>
                <Button variant="contained" component="label">
                  Thêm ảnh
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Button>
              </Stack>
            </Box>

            {/* Preview hình ảnh đã chọn */}
            <Box className="my-5">
              <h6>Hình ảnh đã chọn:</h6>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    style={{ margin: "10px", position: "relative" }}
                  >
                    <img
                      src={URL.createObjectURL(image)} // Hiển thị ảnh
                      alt={`img-${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeImage(image)} // Gọi hàm xóa ảnh
                      style={{ position: "absolute", top: "5px", right: "5px" }}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            </Box>

            {/* Chọn loại cửa hàng */}
            <FormControl>
              <FormLabel
                className="my-3"
                sx={{ fontSize: "16px", color: "black" }}
              >
                Bạn có cửa hàng hay chỉ bán online{" "}
                <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(e) => setIsOnline(e.target.value)}
                value={isOnline}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Chỉ bán online"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Có cửa hàng"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Cả hai"
                />
              </RadioGroup>
            </FormControl>

            <Stack sx={{ justifyContent: "end" }} direction={"row"}>
              <Button
                type="submit"
                sx={{
                  background: "#ffcf20",
                  color: "#1b1b1b",
                  textTransform: "capitalize",
                }}
                variant="contained"
              >
                Gửi đơn
              </Button>
            </Stack>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default ShopRegister;
