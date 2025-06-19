import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { Phone, LocationOn } from "@mui/icons-material";

function CreateOrderAddress() {
  const [cod, setCod] = useState(true);

  return (
    <Box
      p={3}
      sx={{
        maxWidth: "90%",
        margin: "0 auto",
        backgroundColor: "#fff",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        borderRadius: "10px",
      }}
    >
      <h5 className="mb-4">Thông tin nhận hàng</h5>
      {/* Phone Number */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Phone color="primary" />
        <TextField
          fullWidth
          label="Số điện thoại người nhận"
          variant="standard"
          defaultValue="+840984217495"
        />
      </Stack>

      {/* Name */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mt: 2, ml: "40px" }}
      >
        <TextField
          fullWidth
          label="Tên người nhận"
          variant="standard"
          defaultValue="Hiếu"
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mt: 2, ml: "40px" }}
      >
        <TextField
          fullWidth
          label="Email"
          variant="standard"
          defaultValue="Hiếu123@gmail.com"
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Address */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <LocationOn color="success" />
        <TextField fullWidth label="Chọn Tỉnh Thành" variant="standard" />
      </Stack>
      <Box sx={{ ml: "40px", mt: 1 }}>
        <TextField
          fullWidth
          label="Chọn Quận/Huyện"
          variant="standard"
          sx={{ mt: 1 }}
        />
        <TextField
          fullWidth
          label="Chọn Phường/Xã"
          variant="standard"
          sx={{ mt: 1 }}
        />
        <TextField
          fullWidth
          label="Nhập địa chỉ chi tiết"
          variant="standard"
          sx={{ mt: 1 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>
          Voucher
        </Typography>
        <Button sx={{textTransform:"initial"}}>Chọn voucher</Button>
      </Stack>


      {/* Payment and COD */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>
          Giảm giá
        </Typography>
        <TextField
          id=""
          label=""
          defaultValue={"0 "}
          variant="standard"
          sx={{width:"100px"}}
          inputProps={{
            style: {
              textAlign: "right",
            },
          }}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography sx={{ fontWeight: "700", fontSize: "18px" }}>
          Phí vận chuyển
        </Typography>
        <Typography sx={{ fontWeight: "700", fontSize: "19px" }}>0</Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography sx={{ fontWeight: "700", fontSize: "20px" }}>
          Tổng đơn hàng
        </Typography>
        <Typography sx={{ fontWeight: "700", fontSize: "20px" }}>
          3,926,000
        </Typography>
      </Stack>

      <Stack className="mt-3">
        <Button variant="contained">Tạo đơn hàng</Button>
      </Stack>
    </Box>
  );
}

export default CreateOrderAddress;
