import React from "react";
import {
  Container,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  TextField,
  Alert,
} from "@mui/material";

const Step2 = ({
  shippingOptions,
  shipCost,
  handleShippingOption,
  handleInputShipCost,
  err,
}) => {
  return (
    <div id="shop-setup" style={{ minHeight: "500px" }} className="mt-4">
      <Container style={{ width: "80%" }}>
        <FormGroup>
          <h3 className="my-5 text-center">Thiết lập vận chuyển</h3>

          {err && (
            <Alert severity="error" sx={{ my: 4 }}>
              {err}
            </Alert>
          )}

          <Stack sx={{ marginLeft: "50px" }}>
            <p>
              <i>* Lựa chọn báo giá cho đơn hàng (có thể chọn cả hai):</i>
            </p>
            <FormControlLabel
              control={<Checkbox checked={shippingOptions.includes(0)} />}
              label="Báo giá sau khi đặt hàng"
              value={0}
              onChange={(e) => handleShippingOption(0)}
            />
            <FormControlLabel
              control={<Checkbox checked={shippingOptions.includes(1)} />}
              label="Tự báo giá dựa vào số tiền gợi ý"
              value={1}
              onChange={(e) => handleShippingOption(1)}
            />
          </Stack>

          {shippingOptions.includes(1) && (
            <Stack sx={{ marginLeft: "50px", marginTop: "20px" }}>
              <p>
                <i>* Thiết lập giá cho từng khối lượng tính toán:</i>
              </p>

              {shipCost.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  sx={{
                    alignItems: "center",
                    marginBottom: "10px",
                    justifyContent: "space-between",
                    width: "70%",
                    marginLeft: "20px",
                  }}
                  spacing={2}
                >
                  <label style={{ width: "150%" }}>{item.label} :</label>
                  <TextField
                    value={item.cost} // Hiển thị giá trị đã format
                    onChange={(e) => handleInputShipCost(e.target.value, index)}
                    sx={{width:"50%"}}
                    variant="standard"
                    label="Giá tiền"
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </FormGroup>
      </Container>
    </div>
  );
};

export default Step2;
