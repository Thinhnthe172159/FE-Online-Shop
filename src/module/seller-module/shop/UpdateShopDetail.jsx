import React, { useState, useRef, useEffect } from "react";
import { Container, Stack, TextField, Button } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useMutation } from "@tanstack/react-query";
import { updateShopDetail } from "../../../api/shopApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";

const UpdateShopDetail = ({ shop }) => {
  // State để lưu tên cửa hàng, logo và mô tả cửa hàng
  const [shopName, setShopName] = useState(shop.name); // Tên cửa hàng
  const [logo, setLogo] = useState(shop.logo); // Logo cửa hàng (link)
  const [description, setDescription] = useState(shop.description); // Mô tả cửa hàng
  const [preview, setPreview] = useState(shop.logo); // Ảnh preview, khởi tạo bằng logo từ shop
  const logoRef = useRef(null); // Dùng để tham chiếu đến input logo

  // Hàm xử lý khi người dùng chọn logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file); // Lưu file logo vào state
      setPreview(URL.createObjectURL(file)); // Tạo URL preview từ file
    }
  };

  // Hàm xử lý khi người dùng nhấn nút "Lưu thiết lập"
  const handleSaveSettings = () => {
    const newData = {...shop, name: shopName, description:description}
    let form = new FormData();
    if (logo instanceof File) {
        form.append("logo", logo); // Gửi file logo mới nếu có
      }
   
    form.append("data", JSON.stringify(newData));
    mutate(form)

  };

  const { mutate } = useMutation({
    mutationFn: (data) => updateShopDetail(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Cập nhật cửa hàng thành công",
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.refetchQueries(['getShop-detail'])
        }
      });
    },
    onError: (e) => {
        console.log(e);
        
      Swal.fire({
        icon: "error",
        title: "Vui lòng thử lại sau",
        confirmButtonText: "Đi đến trang chủ",
        confirmButtonColor: "#28a745",
      });
    },
  });

  // Hàm xóa logo và preview
  const handleDeleteLogo = () => {
    setLogo(null);
    setPreview(null);
    logoRef.current.value = ""; // Reset input file
  };

  return (
    <div
      id="shop-detail-update"
      style={{ minHeight: "1000px" }}
      className="mt-4"
    >
      <Container style={{ width: "100%" }}>
        <div className="shop-setup-form mt-5">
          <Container style={{ width: "80%" }}>
            <h4 className="my-5 text-center">Thiết Lập chi tiết cửa hàng</h4>

            {/* Tên cửa hàng */}
            <Stack className="mb-5">
              <label htmlFor="" className="mb-3">
                <b>Tên cửa hàng</b> <span style={{ color: "red" }}>*</span> :
              </label>
              <TextField
                sx={{ width: "100%", marginLeft: "20px" }}
                variant="standard"
                label="Câu trả lời của bạn"
                value={shopName} // Gán giá trị từ state
                onChange={(e) => setShopName(e.target.value)} // Cập nhật state khi người dùng nhập
              />
            </Stack>

            {/* Logo cửa hàng */}
            <Stack className="mb-5">
              <label htmlFor="" className="mb-3">
                <b>Logo cửa hàng</b> <span style={{ color: "red" }}>*</span> :
              </label>
              <input
                ref={logoRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleLogoChange} // Xử lý khi chọn logo
              />
              {!preview && (
                <Button onClick={() => logoRef.current.click()}>
                  Upload ảnh
                </Button>
              )}
              {/* Hiển thị ảnh xem trước nếu có */}
              {preview && (
                <Stack spacing={2}>
                  <img
                    src={preview}
                    alt="Logo Preview"
                    style={{
                      marginTop: "20px",
                      maxWidth: "200px",
                      height: "auto",
                    }}
                  />
                  <Button
                    onClick={handleDeleteLogo}
                    sx={{ width: "200px" }}
                    color="error"
                    variant="outlined"
                  >
                    Xóa ảnh
                  </Button>
                </Stack>
              )}
            </Stack>

            {/* Mô tả của hàng */}
            <Stack className="mb-5 mt-5">
              <label htmlFor="" className="mb-3">
                <b>Mô tả của hàng</b> <span style={{ color: "red" }}>*</span> :
              </label>
              <Editor
                id="description"
                apiKey="nzyv83pf6j7byh0gpj2588pjvd3r415xwispf0zt20z4h5s5"
                value={description} // Gán giá trị từ state
                onEditorChange={(content) => setDescription(content)} // Cập nhật state khi thay đổi nội dung
                init={{
                  height: 700,
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
              />
            </Stack>

            {/* Nút lưu thiết lập */}
            <Stack
              className="mb-5"
              direction={"row"}
              sx={{ justifyContent: "end" }}
            >
              <Button
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "100px",
                }}
                variant="contained"
                onClick={handleSaveSettings} // Gọi hàm khi nhấn nút lưu
              >
                Lưu thiết lập
              </Button>
            </Stack>
          </Container>
        </div>
      </Container>
    </div>
  );
};

export default UpdateShopDetail;
