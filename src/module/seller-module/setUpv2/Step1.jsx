import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Container } from "react-bootstrap";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import AddressModalShop from "./AddressModalShop";

const Step1 = ({
  addPhoneNumber,
  phone,
  deletePhone,
  addAddress,
  address,
  deleteAddress,
  handleShopValue,
  handleEditor,
  handlePhoneValue,
  handleLogoUpload,
  logo,
  err,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleLogoUpload(file);
    } else {
      alert("Vui lòng chọn một tệp ảnh hợp lệ.");
    }
  };

  return (
    <div className="mt-5">
      <Container style={{ width: "60%" }}>
        <h4 className="my-5 text-center">Thiết lập cửa hàng</h4>
        {err && (
          <Alert severity="error" sx={{ my: 4 }}>
            {err}
          </Alert>
        )}
        <Stack direction={"column"} spacing={3}>
          <Stack direction={"row"} spacing={3} sx={{ alignItems: "end" }}>
            <Typography variant="body1" color="initial">
              <b>Tên cửa hàng</b> <span style={{ color: "red" }}>*</span> :
            </Typography>
            <TextField
              sx={{ width: "70%" }}
              size="small"
              variant="standard"
              placeholder="Nhập tên cửa hàng"
              name="name"
              onChange={handleShopValue}
            />
          </Stack>

          <Stack direction={"row"} spacing={3} sx={{ alignItems: "end" }}>
            <Typography variant="body1" color="initial">
              <b>Chọn logo cửa hàng</b> <span style={{ color: "red" }}>*</span> :
            </Typography>
            {logo ? (
              <Stack direction={"row"} spacing={2} sx={{alignItems:"end"}}>
                 <img
                  src={URL.createObjectURL(logo)}
                  alt="Logo Preview"
                  style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover" }}
                />
                <Button variant="outlined" component="label">
                  Thay đổi Avatar
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoChange}
                  />
                </Button>
              </Stack>
            ) : (
              <Button variant="outlined" component="label">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
                />
              </Button>
            )}
          </Stack>

          <Stack direction={"row"} spacing={3} sx={{ alignItems: "end" }}>
            <Typography variant="body1" color="initial">
              <b>Thông tin địa chỉ cửa hàng</b>{" "}
              <span style={{ color: "red" }}>*</span> :
            </Typography>
            <Button variant="outlined" onClick={() => setShow(true)}>
              + Thêm địa chỉ
            </Button>
          </Stack>

          {address.map((item, i) => (
            <Stack
              key={i}
              className="mx-3"
              direction={"row"}
              spacing={1}
              sx={{ alignItems: "start" }}
            >
              <Typography sx={{ width: "24%" }} variant="body1" color="initial">
                Địa chỉ {address.length > 1 ? "cơ sở " + (i + 1) : ""}:
              </Typography>
              <Stack
                direction={"row"}
                sx={{ justifyContent: "space-between", width: "100%" }}
              >
                <Typography sx={{ width: "80%" }} variant="body1" color="initial">
                  {item.addressDetail}/ {item.ward}/{item.district}/ {item.province}
                </Typography>

                <Button onClick={() => deleteAddress(i)} color="error" variant="outlined">
                  Xóa
                </Button>
              </Stack>
            </Stack>
          ))}

          <Stack sx={{ alignItems: "start" }}>
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "start",
                width: "100%",
              }}
              className="mt-2"
            >
              <Typography variant="body1" color="initial">
                <b>Số điện thoại cửa hàng</b>{" "}
                <span style={{ color: "red" }}>*</span> :
              </Typography>
              <Button onClick={addPhoneNumber}>+ Thêm số điện thoại</Button>
            </Stack>
            <Stack
              className="mt-2 mx-3"
              direction={"column"}
              spacing={2}
              sx={{ width: "100%" }}
            >
              {phone.map((item, i) => (
                <Stack
                  key={i}
                  direction={"row"}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    variant="standard"
                    placeholder="Nhập số điện thoại"
                    onChange={(e) => handlePhoneValue(i, e)}
                  />

                  <Button
                    onClick={() => deletePhone(i)}
                    size="small"
                    variant="outlined"
                    color="error"
                  >
                    Xóa số điện thoại
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <Container style={{ width: "75%" }}>
        <Stack className="mb-5 mt-5">
          <label htmlFor="" className="mb-3">
            <b> Mô tả của hàng</b> <span style={{ color: "red" }}>*</span> :
          </label>
          <Editor
            onEditorChange={(content) => handleEditor(content)}
            id="description"
            apiKey="nzyv83pf6j7byh0gpj2588pjvd3r415xwispf0zt20z4h5s5"
            init={{
              height: 600,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
          />
        </Stack>
      </Container>
      <AddressModalShop
        addAddress={addAddress}
        show={show}
        handleClose={handleClose}
      ></AddressModalShop>
    </div>
  );
};

export default Step1;
