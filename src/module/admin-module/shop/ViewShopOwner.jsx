import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
const ViewShopOwner = ({ owner,tax }) => {

    console.log(owner);
    
  
  function capitalizeName(fullName) {
    return fullName
      .split(" ") // Chia họ tên thành các từ
      .map((word) => {
        // Viết hoa chữ cái đầu và giữ nguyên các chữ cái còn lại
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" "); // Kết hợp lại thành một chuỗi
  }
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        <Typography sx={{ fontWeight: "600" }} variant="body1" color="initial">
          Thông tin chủ cửa hàng
        </Typography>

        <Box sx={{ ml: 5 }}>
          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
            <Stack
              direction={"row"}
              sx={{ width: "40%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "50%", fontSize: "14px" }}
                color="initial"
              >
                Tên chủ cửa hàng:
              </Typography>
              <TextField
                fullWidth
                label="Tên"
                value={capitalizeName(owner.name)}
                variant="standard"
              />
            </Stack>

            <Stack
              direction={"row"}
              sx={{ width: "50%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "20%", fontSize: "14px" }}
                color="initial"
              >
                Email:
              </Typography>
              <TextField
                fullWidth
                label="Email"
                value={owner.email}
                variant="standard"
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
            <Stack
              direction={"row"}
              sx={{ width: "40%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "50%", fontSize: "14px" }}
                color="initial"
              >
                Mã só thuế
              </Typography>
              <TextField value={tax} fullWidth label="Phí vận chuyển" variant="standard" />
            </Stack>

            <Stack
              direction={"row"}
              sx={{ width: "30%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "40%", fontSize: "14px" }}
                color="initial"
              >
                Số căn cước:
              </Typography>
              <TextField value={owner.identification} fullWidth label="Phí vận chuyển" variant="standard" />
            </Stack>
          </Stack>

       
          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 3 }}>
            <Stack
              direction={"row"}
              sx={{ width: "90%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "16%", fontSize: "14px" }}
                color="initial"
              >
                Khu vực:
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                fullWidth
                label="Khu vực"
                variant="standard"
                value={`${owner.ward} - ${owner.district} - ${owner.province}`}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 4 }}>
            <Stack
              direction={"row"}
              sx={{ width: "90%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "14%", fontSize: "14px" }}
                color="initial"
              >
                Ảnh định danh:
              </Typography>
             <Stack direction={"row"} spacing={2}>
                <img style={{width:"200px", height:"100px", objectFit:'cover', borderRadius:"10px"}} src={owner.front} alt="" />
                <img style={{width:"200px", height:"100px", objectFit:'cover', borderRadius:"10px"}} src={owner.back} alt="" />
             </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewShopOwner;
