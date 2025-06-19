import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { OrbitProgress } from "react-loading-indicators";
import { useQuery } from "@tanstack/react-query";
import { getAllShopOwner } from "../../../api/ShopOwnerApi";



const Step4 = ({ identify, handleIdentifyChange,err,loading }) => {

  const {data} = useQuery({
      queryKey:['shopo'],
      queryFn: getAllShopOwner
  })
  console.log(data);
  

  const handleImageUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      handleIdentifyChange(side === "front" ? "frontImage" : "backImage", file);
    }
  };

  const handleChangeImage = (side) => {
    handleIdentifyChange(side === "front" ? "frontImage" : "backImage", null);
  };

  

  if(loading){
    return (
      <Stack style={{minHeight:"60vh", justifyContent:"center", alignItems:"center"}}>
        <OrbitProgress color="#1976d2" size="medium" text="" textColor="" />
      </Stack>
    )
  }

  return (
    <div className="mt-5">
      <Container style={{ width: "60%" }}>
        <h4 className="my-5 text-center">Thông tin định danh</h4>
        {err && (
            <Alert severity="error" sx={{ my: 4 }}>
              {err}
            </Alert>
          )}
        <Stack direction={"column"} spacing={3}>
          {/* Nhập số căn cước công dân */}
          <Stack
            direction={"row"}
            spacing={3}
            sx={{ alignItems: "end", justifyContent: "space-between" }}
          >
            <Typography variant="body1" color="initial">
              Số căn cước công dân <span style={{ color: "red" }}>*</span> :
            </Typography>
            <TextField
              sx={{ width: "60%" }}
              size="small"
              variant="standard"
              placeholder="Nhập số căn cước công dân"
              value={identify.idNumber || ""}
              onChange={(e) => handleIdentifyChange("idNumber", e.target.value)}
            />
          </Stack>

          {/* Nhập tên trên căn cước công dân */}
          <Stack
            direction={"row"}
            spacing={3}
            sx={{ alignItems: "end", justifyContent: "space-between" }}
          >
            <Typography variant="body1" color="initial">
              Tên trên căn cước công dân <span style={{ color: "red" }}>*</span> :
            </Typography>
            <TextField
              sx={{ width: "60%" }}
              size="small"
              variant="standard"
              placeholder="Nhập tên trên căn cước"
              value={identify.idName || ""}
              onChange={(e) => handleIdentifyChange("idName", e.target.value)}
            />
          </Stack>

          {/* Hình chụp CCCD mặt trước */}
          <Stack
            direction={"row"}
            spacing={3}
            sx={{ alignItems: "start", justifyContent: "space-between" }}
          >
            <Typography variant="body1" color="initial">
              Hình chụp CCCD mặt trước <span style={{ color: "red" }}>*</span> :
            </Typography>
            <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={3}>
              {identify.frontImage ? (
                <>
                  <Stack direction={"column"} spacing={2}>
                    <img
                      src={URL.createObjectURL(identify.frontImage)}
                      alt="CCCD mặt trước"
                      style={{
                        width: "200px",
                        height: "130px",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => handleChangeImage("front")}
                    >
                      Thay đổi ảnh
                    </Button>
                  </Stack>
                </>
              ) : (
                <Box
                  sx={{
                    width: "200px",
                    height: "130px",
                    border: "1px dashed #ccc",
                  }}
                  component="label"
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      lineHeight: "130px",
                      cursor: "pointer",
                    }}
                    variant="body1"
                    color="initial"
                  >
                    <AddIcon />
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, "front")}
                  />
                </Box>
              )}
              <img
                src="https://deo.shopeesz.com/shopee/pap-admin-live-sg/upload/upload_828913370010bd73b9c46b481ae40b89.png"
                alt="Mẫu ảnh CCCD mặt trước"
              />
            </Stack>
          </Stack>

          {/* Hình chụp CCCD mặt sau */}
          <Stack
            direction={"row"}
            spacing={17}
            sx={{ alignItems: "start"  }}
          >
            <Typography variant="body1" color="initial">
              Hình chụp CCCD mặt sau <span style={{ color: "red" }}>*</span> :
            </Typography>
            <Stack direction={"row"} sx={{ alignItems: "center" }} spacing={3}>
              {identify.backImage ? (
                <>
                  <Stack direction={"column"} spacing={2}>
                    <img
                      src={URL.createObjectURL(identify.backImage)}
                      alt="CCCD mặt sau"
                      style={{
                        width: "200px",
                        height: "130px",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => handleChangeImage("back")}
                    >
                      Thay đổi ảnh
                    </Button>
                  </Stack>
                </>
              ) : (
                <Box
                  sx={{
                    width: "200px",
                    height: "130px",
                    border: "1px dashed #ccc",
                  }}
                  component="label"
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      lineHeight: "130px",
                      cursor: "pointer",
                    }}
                    variant="body1"
                    color="initial"
                  >
                    <AddIcon />
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, "back")}
                  />
                </Box>
              )}
            </Stack>
          </Stack>

          {/* Thông báo và checkbox */}
          <Stack>
            <Typography
              sx={{ fontSize: "14px", color: "#ccc" }}
              variant="body1"
              color="initial"
            >
              Vui lòng cung cấp ảnh chụp cận CMND/CCCD/Hộ chiếu của bạn. Các
              thông tin trong CMND/CCCD/Hộ chiếu phải được hiển thị rõ ràng
              (Kích thước ảnh không vượt quá 5.0 MB).
            </Typography>
          </Stack>

          
        </Stack>
      </Container>
    </div>
  );
};

export default Step4;
