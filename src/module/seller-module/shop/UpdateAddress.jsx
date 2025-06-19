import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { updateShopAddress } from "../../../api/shopApi";
import Swal from "sweetalert2";

const UpdateAddress = ({ shopData, shop }) => {
  const [province, setProvince] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((data) => setProvince(data.data.data));
  }, []);

  const getDataDistrict = async (id) => {
    let data = await axios.get(`https://esgoo.net/api-tinhthanh/2/${id}.htm`);
    return data.data.data;
  };

  const getDataWard = async (id) => {
    let data = await axios.get(`https://esgoo.net/api-tinhthanh/3/${id}.htm`);
    return data.data.data;
  };

  useEffect(() => {
    const updateAddresses = async () => {
      if (shopData != null && province.length > 0) {
        const updatedAddresses = await Promise.all(
          shopData.map(async (shopAddress) => {
            const provinceOb = province.find(
              (item) => item.name === shopAddress.province
            );

            // Nếu tìm thấy provinceOb, gọi API lấy danh sách quận/huyện
            if (provinceOb) {
              const disDistrictData = await getDataDistrict(provinceOb.id);

              let districSelect = disDistrictData.find(
                (item) => item.name === shopAddress.district
              );

              const wardData = await getDataWard(districSelect.id);

              const wardSelect = wardData.find(
                (item) => item.name === shopAddress.ward
              );
              return {
                id: shopAddress.id,
                detail: shopAddress.addressDetail,
                province: provinceOb,
                district: districSelect,
                ward: wardSelect,
                listDistrict: disDistrictData,
                listWard: wardData, // Ban đầu để rỗng, có thể lấy dữ liệu khi chọn quận/huyện
              };
            } else {
              // Nếu không tìm thấy province, giữ nguyên dữ liệu gốc
              return shopAddress;
            }
          })
        );
        setAddresses(updatedAddresses);
      }
    };
    updateAddresses(); // Gọi hàm cập nhật địa chỉ khi có dữ liệu
  }, [shopData, province]);

  // Hàm xử lý khi thêm địa chỉ
  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        id: 0,
        detail: "",
        province: null,
        district: null,
        ward: null,
        listDistrict: [],
        listWard: [],
      },
    ]);
  };

  const handeleDelete =(i) =>{
      setAddresses(addresses.filter((item,index)  => index !== i))
  }

  // Hàm cập nhật detail của địa chỉ
  const handleDetailChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].detail = value;
    setAddresses(updatedAddresses);
  };

  // Hàm xử lý khi chọn tỉnh thành
  const handleProvinceChange = async (index, value) => {
    const updatedAddresses = [...addresses];

    if (value === "") {
      // Nếu chọn rỗng thì reset lại district và ward
      updatedAddresses[index].province = null;
      updatedAddresses[index].district = null;
      updatedAddresses[index].ward = null;
      updatedAddresses[index].listDistrict = [];
      updatedAddresses[index].listWard = [];
    } else {
      const selectedProvince = JSON.parse(value);
      updatedAddresses[index].province = selectedProvince;
      updatedAddresses[index].district = null; // Reset district khi chọn lại province
      updatedAddresses[index].ward = null; // Reset ward khi chọn lại province
      updatedAddresses[index].listDistrict = await getDataDistrict(
        selectedProvince.id
      );
      updatedAddresses[index].listWard = []; // Reset listWard
    }
    setAddresses(updatedAddresses);
  };

  // Hàm xử lý khi chọn quận/huyện
  const handleDistrictChange = async (index, value) => {
    const updatedAddresses = [...addresses];

    if (value === "") {
      // Nếu chọn rỗng thì reset lại ward
      updatedAddresses[index].district = null;
      updatedAddresses[index].ward = null;
      updatedAddresses[index].listWard = [];
    } else {
      const selectedDistrict = JSON.parse(value);
      updatedAddresses[index].district = selectedDistrict;
      updatedAddresses[index].ward = null; // Reset ward khi chọn lại district
      updatedAddresses[index].listWard = await getDataWard(selectedDistrict.id);
    }
    setAddresses(updatedAddresses);
  };

  // Hàm xử lý khi chọn xã/phường
  const handleWardChange = (index, value) => {
    const selectedWard = JSON.parse(value);
    const updatedAddresses = [...addresses];
    updatedAddresses[index].ward = selectedWard;
    setAddresses(updatedAddresses);
  };

  const { mutate } = useMutation({
    mutationFn: (data) => updateShopAddress(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Cập nhật địa chỉ thành công",
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
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      });
    },
  });

  const handleSubmit = () => {
    const formattedAddress = addresses.map((item) => ({
      id: item.id,
      province: item.province ? item.province.name : null,
      district: item.district ? item.district.name : null,
      ward: item.ward ? item.ward.name : null,
      addressDetail: item.detail,
    }));
    mutate(formattedAddress);
  };

  return (
    <div id="update-address" style={{ height: "1000px" }}>
      <Container style={{ width: "60%" }}>
        <h4 className="text-center mt-5">Thiết lập địa chỉ</h4>
        <Box sx={{ marginTop: "30px" }}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="body1" color="initial">
              <b>Quản lý địa chỉ :</b>
            </Typography>
            <Button onClick={handleAddAddress} variant="outlined">
              Thêm Địa chỉ
            </Button>
          </Stack>
        </Box>

        {addresses.map((item, index) => (
          <Box key={index}>
            <Stack className="my-5 mx-4 ">
              <Stack
                direction={"row"}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="mb-2">
                  <b>
                    <i>Địa chỉ cơ sở {index + 1} </i>{" "}
                  </b>{" "}
                  :
                </span>
                <Stack
                  direction={"row"}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  spacing={3}
                >
                  {index > 0 ? (
                    <Button onClick={() =>handeleDelete(index)} color="error" variant="outlined">
                      Xóa địa chỉ
                    </Button>
                  ) : (
                    ""
                  )}
                </Stack>
              </Stack>
             
              <Stack sx={{ marginLeft: "20px" }} direction={"row"} spacing={4}>
                <FormControl variant="standard" sx={{ m: 1, width: "30%" }}>
                  <InputLabel>Chọn tỉnh thành</InputLabel>
                  <Select
                    label="Chọn tỉnh thành"
                    value={item.province ? JSON.stringify(item.province) : ""}
                    onChange={(e) =>
                      handleProvinceChange(index, e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {province.map((pro) => (
                      <MenuItem key={pro.id} value={JSON.stringify(pro)}>
                        {pro.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="standard" sx={{ m: 1, width: "30%" }}>
                  <InputLabel>Chọn Quận/Huyện</InputLabel>
                  <Select
                    label="Chọn Quận/Huyện"
                    value={item.district ? JSON.stringify(item.district) : ""}
                    onChange={(e) =>
                      handleDistrictChange(index, e.target.value)
                    }
                    disabled={!item.listDistrict.length}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {item.listDistrict.map((district) => (
                      <MenuItem
                        key={district.id}
                        value={JSON.stringify(district)}
                      >
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="standard" sx={{ m: 1, width: "30%" }}>
                  <InputLabel>Chọn Xã/Phường</InputLabel>
                  <Select
                    label="Chọn Xã/Phường"
                    value={item.ward ? JSON.stringify(item.ward) : ""}
                    onChange={(e) => handleWardChange(index, e.target.value)}
                    disabled={!item.listWard.length}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {item.listWard.map((ward) => (
                      <MenuItem key={ward.id} value={JSON.stringify(ward)}>
                        {ward.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
              </Stack>
              <Stack
                direction={"row"}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt:3
                }}
              >
                <TextField
                  className="mb-3"
                  sx={{ width: "70%", marginLeft: "20px" }}
                  variant="standard"
                  label="Địa chỉ chi tiết"
                  value={item.detail}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                />
              </Stack>
            </Stack>
          </Box>
        ))}

        <Button onClick={handleSubmit}>Cập nhật địa chỉ</Button>
      </Container>
    </div>
  );
};

export default UpdateAddress;
