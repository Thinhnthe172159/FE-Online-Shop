import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { saveShop } from "../../../api/shopApi";
import { Button, Checkbox, FormControlLabel, Stack, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Step5 = ({ setupData }) => {
  const navigate = useNavigate();
  const { mutate, isLoading, isSuccess, isError } = useMutation({
    mutationFn: (content) => saveShop(content),
    onSuccess: (data) => {
      navigate("/seller");
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  console.log(setupData);
  
  const transformShipCost = (shipCost) => {
    return shipCost.map((item) => ({
      startWeight: item.startWeight,
      endWeight: item.endWeight,
      cost: item.finalCost,
    }));
  };

  // Chuẩn bị dữ liệu shop
  const shop = {
    name: setupData.shop.name,
    description: setupData.shop.desc,
    autoShipCost:
      setupData.shippingOptions.length === 1 ? setupData.shippingOptions[0] : 3,
    shopAddresses: setupData.address,
    shopPhones: setupData.phone,
    shipCosts:
      setupData.shippingOptions.length === 2 ||
      setupData.shippingOptions[0] === 1
        ? transformShipCost(setupData.shipCost)
        : [],
  };

  // Chuẩn bị FormData cho API
  const formData = new FormData();
  formData.append(
    "shop",
    JSON.stringify({ ...shop, taxNumber: setupData.taxNumber })
  );
  formData.append("logo", setupData.logo);
  setupData.businessLicenseImages.forEach((image) => {
    formData.append("businessLicenseImages", image);
  });
  formData.append("frontImage", setupData.identify.frontImage);
  formData.append("backImage", setupData.identify.backImage);
  formData.append(
    "identify",
    JSON.stringify({
      name: setupData.identify.idName,
      number: setupData.identify.idNumber,
      province: setupData.identify.province,
      district: setupData.identify.district,
      ward: setupData.identify.ward
    })
  );

  // Trạng thái xác nhận và lỗi
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);

  // Hàm gọi API khi nhấn nút
  const handleSubmit = () => {
    if (!isConfirmed) {
      setError("Vui lòng xác nhận thông tin");
      return;
    }
    setError(null); // Clear lỗi nếu checkbox đã được chọn
    mutate(formData);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h4>Hoàn thành</h4>
      {error && <Alert className="my-3" severity="error">{error}</Alert>}
      <p>
        Sau khi hoàn tất, thông tin cửa hàng và thông tin định danh của bạn sẽ
        được lưu lại, và bạn có thể bắt đầu bán hàng.
      </p>
      <Stack sx={{ alignItems: "center" }}>
        <FormControlLabel
          control={<Checkbox checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />}
          label="Tôi xác nhận tất cả dữ liệu đã cung cấp là chính xác và trung thực"
        />
       
      </Stack>
      <Button variant="outlined" onClick={handleSubmit} disabled={isLoading}>
        Lưu thông tin
      </Button>
    </div>
  );
};

export default Step5;
