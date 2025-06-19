import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { updateShippingCost } from "../../../api/shopApi";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";

const UpdateShipCost = ({ shop }) => {
  const [err, setErr] = useState(null);
  const [showAutoCost, setShowAutoCost] = useState(
    shop.autoShipCost === 1 || shop.autoShipCost === 3
  ); // Kiểm tra giá trị từ prop
  const [quote, setQuote] = useState(
    shop.autoShipCost === 1 ? [1] : shop.autoShipCost === 3 ? [0, 1] : [0]
  ); // Xử lý cho trường hợp autoShipCost = 3

  // Hàm để định dạng giá theo VND với dấu chấm phân cách hàng nghìn
  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Hàm để loại bỏ định dạng VND và trả về số nguyên
  const unformatCurrency = (value) => {
    return value.replace(/\./g, "");
  };

  const [manageShip, setManageShip] = useState([
    {
      id: "", // Thêm trường id
      name: "Hàng nhẹ (khối lượng tính toán từ 0 - 2 kg)",
      cost: "", // Giá mà người dùng nhập vào
      finalCost: "", // Giá không có định dạng để lưu vào cơ sở dữ liệu
    },
    {
      id: "", // Thêm trường id
      name: "Hàng trung bình (khối lượng tính toán từ 2 - 5 kg)",
      cost: "", // Giá mà người dùng nhập vào
      finalCost: "", // Giá không có định dạng để lưu vào cơ sở dữ liệu
    },
    {
      id: "", // Thêm trường id
      name: "Hàng nặng (khối lượng tính toán trên 5kg)",
      cost: "", // Giá mà người dùng nhập vào
      finalCost: "", // Giá không có định dạng để lưu vào cơ sở dữ liệu
    },
    
  ]);

  // Sử dụng useEffect để cập nhật manageShip từ shipCosts nếu shop.autoShipCost = 1 hoặc 3
  useEffect(() => {
    if (shop.autoShipCost === 1 || shop.autoShipCost === 3) {
      const updatedShipCosts = manageShip.map((item) => {
        const correspondingShipCost = shop.shipCosts.find((shipCost) => {
          return (
            (item.name.includes("nhẹ") &&
              shipCost.startWeight === 0 &&
              shipCost.endWeight === 2) ||
            (item.name.includes("trung bình") &&
              shipCost.startWeight === 2 &&
              shipCost.endWeight === 5) ||
            (item.name.includes("nặng") &&
              shipCost.startWeight === 5)
          );
        });
  
        if (correspondingShipCost) {
          return {
            ...item,
            id: correspondingShipCost.id,
            cost: formatCurrency(correspondingShipCost.cost.toString()),
            finalCost: correspondingShipCost.cost.toString(),
          };
        }
        return item;
      });
      setManageShip(updatedShipCosts);
    }
  }, [shop]);

  // Hàm xử lý khi người dùng nhập giá
  const handleInputShip = (value, index) => {
    const updatedManageShip = [...manageShip];
    const unformattedValue = unformatCurrency(value); // Loại bỏ định dạng trước khi lưu
    updatedManageShip[index].cost = formatCurrency(unformattedValue); // Định dạng giá tiền
    updatedManageShip[index].finalCost = unformattedValue; // Lưu giá trị không định dạng vào finalCost
    setManageShip(updatedManageShip);
  };

  const handleCheckBox = (e) => {
    const value = parseInt(e.target.value); // Lấy giá trị checkbox dưới dạng số
    if (value === 1) {
      setShowAutoCost(e.target.checked); // Cập nhật trạng thái hiển thị phần báo giá tự động nếu chọn hệ thống tự báo giá
    }
    if (e.target.checked) {
      setQuote([...quote, value]); // Nếu checkbox được chọn, thêm giá trị vào mảng quote
    } else {
      setQuote(quote.filter((item) => item !== value)); // Nếu checkbox bị bỏ chọn, xóa giá trị khỏi mảng quote
    }
  };

  const { mutate } = useMutation({
    mutationFn: (data) => updateShippingCost(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Cập nhật giá vận chuyển thành công",
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

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
  
    const formattedManageShip = !showAutoCost
      ? []
      : manageShip.map((item, index) => ({
          id: item.id,
          startWeight: index === 0 ? 0 : index === 1 ? 2 : 5, // Cập nhật khoảng cân nặng
          endWeight: index === 0 ? 2 : index === 1 ? 5 : null,
          cost: parseInt(item.finalCost),
        }));
  
    let formattedAutoShipCost = quote.length === 1 ? quote[0] : 3;
    shop.autoShipCost = formattedAutoShipCost;
  
    if (formattedAutoShipCost === 0) {
      shop.shipCosts = [];
    } else {
      shop.shipCosts = formattedManageShip;
    }
  
    mutate(shop);
  };

  const validate = () => {
    if (quote.length === 0) {
      setErr("Vui lòng chọn phương thức báo giá ship.");
      return false;
    }

    // Nếu hệ thống tự báo giá được chọn, kiểm tra các điều kiện của giá tiền
    if (quote.includes(1)) {
      for (const item of manageShip) {
        const costValue = item.finalCost; // Lấy giá trị không định dạng

        // Kiểm tra bắt buộc nhập
        if (!costValue || costValue.trim() === "") {
          setErr(`Giá tiền cho ${item.name} là bắt buộc.`);
          return false;
        }

        // Kiểm tra phải là số
        if (isNaN(costValue)) {
          setErr(`Giá tiền cho ${item.name} phải là số.`);
          return false;
        }

        // Kiểm tra số dương và lớn hơn 1000
        const numericValue = parseInt(costValue);
        if (numericValue <= 0 || numericValue < 1000) {
          setErr(`Giá tiền cho ${item.name} không hợp lệ`);
          return false;
        }
      }
    }

    // Nếu tất cả đều hợp lệ, reset lỗi
    setErr(null);
    return true;
  };

  return (
    <div>
      {/* Quản lý vận chuyển */}
      <Container style={{ width: "80%" }}>
        <h4 className="text-center mt-5">Thiết lập vận chuyển</h4>
        <Stack className="mb-5 mt-5">
          {err && (
            <Alert className="my-3" severity="error">
              {err}
            </Alert>
          )}
          <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
            <label htmlFor="" className="mb-3">
              <b> Quản lý vận chuyển</b> <span style={{ color: "red" }}>*</span>{" "}
              :
            </label>
          </Stack>

          <Stack>
            <ul>
              <li>
                Khối lượng sẽ được tính tùy theo chiều rộng, chiều dài và chiều
                cao và giá sẽ được gợi ý trong đơn hàng của khách hàng
              </li>
              <li>
                Bạn cũng có thể báo giá sau cho khách sau khi khách đặt hàng
              </li>
            </ul>
          </Stack>

          <Stack sx={{ marginLeft: "50px" }}>
            <p>
              <i>
                * Lựa chọn báo giá cho đơn hàng (có thể chọn cả hai){" "}
                <span style={{ color: "red" }}>*</span> :{" "}
              </i>
            </p>
            <FormGroup onChange={handleCheckBox}>
              <FormControlLabel
                control={<Checkbox checked={quote.includes(0)} />}
                label="Báo giá cho khách hàng sau khi đặt hàng"
                value={0}
              />
              <FormControlLabel
                control={<Checkbox checked={quote.includes(1)} />}
                label="Hệ thống tự báo giá trong hóa đơn dựa vào số tiền bạn gợi ý"
                value={1}
              />
            </FormGroup>
          </Stack>

          {showAutoCost ? (
            <Stack sx={{ marginLeft: "50px", marginTop: "20px" }}>
              <p>
                <i>
                  * Thiết lập giá cho từng khối lượng tính toán{" "}
                  <span style={{ color: "red" }}>*</span> :{" "}
                </i>
              </p>

              {manageShip.map((item, index) => {
                return (
                  <Stack
                    key={index}
                    direction={"row"}
                    sx={{
                      alignItems: "end",
                      justifyContent: "space-between",
                      marginLeft: "50px",
                    }}
                  >
                    <label htmlFor="">{item.name} :</label>
                    <TextField
                      onChange={(e) => handleInputShip(e.target.value, index)}
                      value={item.cost}
                      sx={{ width: "40%" }}
                      variant="standard"
                      id=""
                      label="Giá tiền"
                    />
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            ""
          )}
        </Stack>
        <Button onClick={handleSubmit}>Submit</Button>
      </Container>
    </div>
  );
};

export default UpdateShipCost;
