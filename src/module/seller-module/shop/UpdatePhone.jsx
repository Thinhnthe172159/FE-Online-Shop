import React, { useState, useEffect } from "react";
import { Container, Button, Stack, TextField, Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { updateShopPhone } from "../../../api/shopApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";

const ManagePhone = ({ shop }) => {
  const [err, setErr] = useState(null);

  // Khởi tạo state từ prop shopPhones
  const [phone, setPhone] = useState([]);

  // Đưa shopPhones từ shop vào state khi component mount
  useEffect(() => {
    if (shop && shop.shopPhones) {
      const formattedPhones = shop.shopPhones.map((item) => ({
        id: item.id || 0, // Nếu không có id thì gán giá trị là 0
        value: item.phoneNumber || "", // Giá trị số điện thoại
        err: false, // Kiểm tra lỗi
        errMess: null, // Thông báo lỗi
      }));
      setPhone(formattedPhones);
    }
  }, [shop]);

  // Thêm số điện thoại mới
  const handleAddPhone = () => {
    setPhone([
      ...phone,
      {
        id: 0, // ID sẽ là 0 cho số điện thoại mới
        value: "",
        err: false,
        errMess: null,
      },
    ]);
  };

  // Xóa số điện thoại
  const handleDeletePhone = (index) => {
    setPhone(phone.filter((item, i) => i !== index));
  };

  // Xử lý input số điện thoại
  const handleInputPhone = (value, index) => {
    const updatePhone = [...phone];

    // Cập nhật giá trị mới cho số điện thoại ngay khi người dùng nhập
    updatePhone[index].value = value;

    // Kiểm tra nếu số điện thoại có đủ 10 chữ số thì mới kiểm tra regex
    if (value.length === 10 && value.length < 11) {
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

      if (!phoneRegex.test(value)) {
        updatePhone[index].err = true;
        updatePhone[index].errMess = "Số điện thoại không hợp lệ";
      } else {
        updatePhone[index].err = false;
        updatePhone[index].errMess = null;
      }
    } else {
      // Nếu chưa đủ 10 chữ số, có lỗi
      updatePhone[index].err = true;
      updatePhone[index].errMess = "Số điện thoại không hợp lệ";
    }
    setPhone(updatePhone);
  };

  // Hàm validate kiểm tra toàn bộ danh sách số điện thoại
  const validatePhones = () => {
    let isValid = true;
    const updatedPhones = [...phone];
    updatedPhones.forEach((item, index) => {
      if (!item.value || item.value.trim() === "") {
        updatedPhones[index].err = true;
        updatedPhones[index].errMess = "Số điện thoại là bắt buộc.";
        isValid = false;
      } else if (item.value.length !== 10) {
        updatedPhones[index].err = true;
        updatedPhones[index].errMess = "Số điện thoại phải có 10 chữ số.";
        isValid = false;
      } else {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(item.value)) {
          updatedPhones[index].err = true;
          updatedPhones[index].errMess = "Số điện thoại không hợp lệ.";
          isValid = false;
        } else {
          updatedPhones[index].err = false;
          updatedPhones[index].errMess = null;
        }
      }
    });
    setPhone(updatedPhones);
    return isValid;
  };

  const { mutate } = useMutation({
    mutationFn: (data) => updateShopPhone(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Cập nhật số điện thoại thành công",
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.refetchQueries(["getShop-detail"]);
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

  // Hàm submit
  const handleSubmit = () => {
    if (!validatePhones()) {
      setErr("Vui lòng kiểm tra lại các số điện thoại.");
      return;
    }

    // Xử lý dữ liệu phone trước khi gửi
    const formattedPhone = phone.map((item) => ({
      id: item.id || 0, // Nếu không có id thì gán giá trị là 0
      phoneNumber: item.value,
    }));

    // Thực hiện submit dữ liệu, ví dụ gửi dữ liệu lên server
    console.log("Dữ liệu số điện thoại gửi đi:", formattedPhone);
    shop.shopPhones = formattedPhone;

    // Sau khi gửi, xóa bỏ thông báo lỗi
    mutate(shop)
  };

  return (
    <div>
      <Container style={{ width: "80%" }}>
        <h4 className="text-center mt-5">Quản lý Số Điện Thoại</h4>
        <Stack className="mb-5 mt-5">
          {err && (
            <Alert className="my-3" severity="error">
              {err}
            </Alert>
          )}

          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <label htmlFor="" className="mb-3">
              <b> Số điện thoại</b> <span style={{ color: "red" }}>*</span> :
            </label>
            <Button onClick={handleAddPhone} variant="outlined">
              + Thêm số điện thoại
            </Button>
          </Stack>

          {/* Vòng lặp qua các số điện thoại */}
          {phone.map((item, index) => (
            <Stack
              key={index}
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "space-between" }}
              className="mb-3"
            >
              <TextField
                onChange={(e) => handleInputPhone(e.target.value, index)}
                value={item.value}
                sx={{ width: "70%", marginLeft: "20px" }}
                variant="standard"
                error={item.err}
                helperText={item.err && item.errMess}
                label="Nhập số điện thoại"
              />
              {index > 0 ? (
                <Button
                  onClick={() => handleDeletePhone(index)}
                  color="error"
                  variant="outlined"
                >
                  + Xóa số điện thoại
                </Button>
              ) : null}
            </Stack>
          ))}
        </Stack>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu số điện thoại
        </Button>
      </Container>
    </div>
  );
};

export default ManagePhone;
