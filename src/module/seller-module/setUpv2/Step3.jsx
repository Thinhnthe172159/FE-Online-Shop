import React from "react";
import Typography from "@mui/material/Typography";
import { Container, Form } from "react-bootstrap";
import { Alert, Button, Stack, TextField } from "@mui/material";

const Step3 = ({ 
  taxNumber, 
  handleTaxNumberChange, 
  businessLicenseImages, 
  handleBusinessLicenseUpload ,
  err
}) => {
  return (
    <div className="mt-5">
      <Container style={{ width: "70%" }}>
        <h4 className="my-5 text-center">Thông tin thuế</h4>
        {err && (
            <Alert severity="error" sx={{ my: 4 }}>
              {err}
            </Alert>
          )}
        <Stack direction={"column"} spacing={3}>
          {/* Trường nhập mã số thuế */}
          <Stack direction={"row"} spacing={3} sx={{ alignItems: "end" }}>
            <Typography variant="body1" color="initial">
              Mã số thuế <span style={{ color: "red" }}>*</span> :
            </Typography>
            <TextField
              sx={{ width: "70%" }}
              size="small"
              variant="standard"
              placeholder="Nhập mã số thuế"
              value={taxNumber}
              onChange={handleTaxNumberChange}
            />
          </Stack>

          {/* Tải ảnh giấy phép kinh doanh */}
          <Stack direction={"row"} spacing={3} sx={{ alignItems: "end" }}>
            <Typography variant="body1" color="initial">
              Giấy phép kinh doanh:
            </Typography>
            <Button component="label" sx={{ textTransform: "initial" }} variant="outlined">
              + Tải ảnh
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleBusinessLicenseUpload}
              />
            </Button>
          </Stack>

          {/* Hiển thị preview ảnh giấy phép kinh doanh */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {businessLicenseImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`license-${index}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ))}
          </Stack>

          {/* Thông tin thêm về yêu cầu mã số thuế */}
          <Stack>
            <Typography
              sx={{ fontSize: "14px", color: "#ccc" }}
              variant="body1"
              color="initial"
            >
              Theo Quy định về Thương mại điện tử Việt Nam (Nghị định
              52/2013/ND-CP), Người Bán phải cung cấp thông tin Mã số thuế cho
              sàn Thương mại điện tử.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
};

export default Step3;
