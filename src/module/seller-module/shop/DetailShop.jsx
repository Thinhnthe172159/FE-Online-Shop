import React from "react";
import parse from "html-react-parser";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { ChangeStatusShop } from "../../../api/shopApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
export default function ProfilePage({ shop, admin }) {

  const {mutate} = useMutation({
    mutationFn:() => ChangeStatusShop(shop.id),
    onSuccess: () =>{
      queryClient.refetchQueries(['admin-shop-detail'])
      Swal.fire({
        icon:"success",
        text:"Đã cập nhật"
      })
    },
    onError: () => {
      Swal.fire({
        icon:"error",
        text:"Vui lòng thử lại sau"
      })
    }
  })
  return (
    <section>
      <MDBContainer className="py-5" style={{ minHeight: "100vh" }}>
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard
              className="mb-4"
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            >
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={shop.logo}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                />
                <p className="text-muted mb-1">{shop.name}</p>

                <div className="d-flex justify-content-center mb-2">
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  >
                    <Link to={"/seller/update-shop"}> Chỉnh sửa thông tin</Link>
                  </Button>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard
              className="mb-4 mb-lg-0"
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            >
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-center align-items-center p-3">
                    <Stack
                      direction={"row"}
                      spacing={2}
                      sx={{ justifyContent: "center" }}
                    >
                      <Typography variant="body1" color="initial">
                        Trạng thái cửa hàng :{" "}
                        {shop.status == 1
                          ? "Chưa ký hợp đồng"
                          : "Đã ký hợp đồng"}
                      </Typography>
                    </Stack>
                  </MDBListGroupItem>
                 {admin && shop.status != 2 &&  <Stack sx={{p:2}} direction={"row"} justifyContent={"center"}>
                    <Button onClick={() => mutate()} variant="contained">Đã ký hợp đồng</Button>
                  </Stack>}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard
              className="mb-4"
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            >
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Tên cửa hàng :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {shop.name}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <hr />
                {shop.shopAddresses.map((address, index) => {
                  return (
                    <MDBRow className="mb-4">
                      <MDBCol sm="3">
                        <MDBCardText>Địa chỉ cơ sở: {index}</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          <Stack>
                            <MDBCardText className="text-muted">
                              {address.addressDetail}
                            </MDBCardText>
                            <Stack direction={"row"} spacing={2}>
                              <TextField
                                value={address.ward}
                                label="Xã/phường"
                                variant="standard"
                              />
                              <TextField
                                label="Quận/huyện"
                                variant="standard"
                                value={address.district}
                              />
                              <TextField
                                label="Tỉnh thành"
                                variant="standard"
                                value={address.province}
                              />
                            </Stack>
                          </Stack>
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                  );
                })}
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Số điện thoại :</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {shop.shopPhones.map((phone) => {
                      return (
                        <MDBCardText className="text-muted">
                          * {phone.phoneNumber}
                        </MDBCardText>
                      );
                    })}
                  </MDBCol>
                </MDBRow>

                <hr />
              </MDBCardBody>
            </MDBCard>

            <MDBCard
              className="mb-4"
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            >
              <MDBCardBody>
                <Box>{parse(shop.description)}</Box>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
