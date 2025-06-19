import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { updateAddress } from "../../../api/addressApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";

const UpdateAddressModel = ({ address, show, closeShow }) => {
  let [err, setErr] = useState({
    province: null,
    district: null,
    ward: null,
  });
  let [haveErr, setHaveErr] = useState(false);
  let [province, setProvince] = useState(null);
  let [district, setDistrict] = useState(null);
  let [ward, setWard] = useState(null);
  let [selectProvince, setSelectProvince] = useState("");
  let [selectDistrict, setSelectDistrict] = useState("");
  let [selectWard, setSelectWard] = useState("");
  let [selectDefault, setSelectDefault] = useState(address.isDefault || 0);

  let formdata = [
    { name: "name", label: "Nhập tên địa chỉ" },
    { name: "nameReceiver", label: "Nhập họ tên người liên hệ" },
    { name: "phone", label: "Nhập số điện thoại liên hệ" },
    { name: "address", label: "Nhập địa chỉ" },
  ];

  // Load danh sách tỉnh thành
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        if (!province) {
          const provinceRes = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
          setProvince(provinceRes.data.data);
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
      }
    };
    loadProvinces();
  }, []); // Chỉ chạy một lần khi mount

  // Load dữ liệu ban đầu từ address khi modal mở
  useEffect(() => {
    const loadInitialData = async () => {
      if (show && address && province && !selectProvince) { // Chỉ chạy khi chưa set selectProvince
        console.log("Loading initial data for address:", address);
        const initialProvince = province.find(
          (item) => item.name === address.province
        );
        if (initialProvince && !selectProvince) {
          setSelectProvince({ name: initialProvince.name, id: initialProvince.id });
          console.log("Set selectProvince:", initialProvince);

          const districtRes = await axios.get(
            `https://esgoo.net/api-tinhthanh/2/${initialProvince.id}.htm`
          );
          const districtData = districtRes.data.data;
          setDistrict(districtData);

          const initialDistrict = districtData.find(
            (item) => item.name === address.district
          );
          if (initialDistrict && !selectDistrict) {
            setSelectDistrict({
              name: initialDistrict.name,
              id: initialDistrict.id,
            });
            console.log("Set selectDistrict:", initialDistrict);

            const wardRes = await axios.get(
              `https://esgoo.net/api-tinhthanh/3/${initialDistrict.id}.htm`
            );
            const wardData = wardRes.data.data;
            setWard(wardData);

            const initialWard = wardData.find(
              (item) => item.name === address.ward
            );
            if (initialWard && !selectWard) {
              setSelectWard({ name: initialWard.name, id: initialWard.id });
              console.log("Set selectWard:", initialWard);
            }
          }
        }
      }
    };
    loadInitialData();
  }, [show, address, province]); // Giữ dependency array nhưng kiểm tra state

  // Load quận/huyện khi tỉnh thay đổi
  useEffect(() => {
    if (selectProvince && selectProvince.id && !district) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${selectProvince.id}.htm`)
        .then((data) => setDistrict(data.data.data))
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectProvince, district]);

  // Load xã/phường khi quận/huyện thay đổi
  useEffect(() => {
    if (selectDistrict && selectDistrict.id && !ward) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${selectDistrict.id}.htm`)
        .then((data) => setWard(data.data.data))
        .catch((error) => console.error("Error fetching wards:", error));
    }
  }, [selectDistrict, ward]);

  // Xử lý khi chọn tỉnh/thành phố
  const handleSelectProvince = (e) => {
    e.preventDefault();
    const value = e.target.value ? JSON.parse(e.target.value) : "";
    if (value) {
      setSelectProvince(value);
      setSelectDistrict("");
      setSelectWard("");
      setDistrict(null);
      setWard(null);
      setErr({ ...err, province: null });
      setHaveErr(false);
    } else {
      setSelectProvince("");
      setSelectDistrict("");
      setSelectWard("");
      setDistrict(null);
      setWard(null);
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleSelectDistrict = (e) => {
    e.preventDefault();
    const value = e.target.value ? JSON.parse(e.target.value) : "";
    if (value) {
      setSelectDistrict(value);
      setSelectWard("");
      setWard(null);
      setErr({ ...err, district: null });
      setHaveErr(false);
    } else {
      setSelectDistrict("");
      setSelectWard("");
      setWard(null);
    }
  };

  // Xử lý khi chọn xã/phường
  const handleSelectWard = (e) => {
    e.preventDefault();
    const value = e.target.value ? JSON.parse(e.target.value) : "";
    if (value) {
      setSelectWard(value);
      setErr({ ...err, ward: null });
      setHaveErr(false);
    } else {
      setSelectWard("");
    }
  };

  const handleCheckboxChange = (e) => {
    setSelectDefault(e.target.checked ? 1 : 0);
  };

  // Schema validate với Yup
  let schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên địa chỉ"),
    nameReceiver: yup.string().required("Vui lòng nhập tên người nhận"),
    phone: yup
      .string()
      .required("Vui lòng nhập số điện thoại")
      .matches(
        "^(0[3|5|7|8|9][0-9]{8})$|^(01[2|6|8|9][0-9]{8})$",
        "Số điện thoại không hợp lệ"
      ),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
  });

  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: address.name || "",
      nameReceiver: address.nameReceiver || "",
      phone: address.phone || "",
      address: address.address || "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  // Kết nối backend
  const { mutate } = useMutation({
    mutationFn: (content) => updateAddress(content),
    onSuccess: () => {
      queryClient.refetchQueries(["get-add-address"]);
      closeShow();
      reset();
      setSelectDefault(0);
      setSelectDistrict("");
      setSelectProvince("");
      setSelectWard("");
      Swal.fire({
        icon: "success",
        title: "Cập nhật địa chỉ thành công",
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      }).then((result) => {
        if (result.isConfirmed) {
          closeShow();
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
      }).then((result) => {
        if (result.isConfirmed) {
          closeShow();
        }
      });
    },
  });

  // Submit form
  const onSubmit = (data) => {
    if (!selectProvince) {
      setErr({ ...err, province: "Vui lòng chọn tỉnh thành" });
      setHaveErr(true);
      return;
    } else if (!selectDistrict) {
      setErr({ ...err, district: "Vui lòng chọn quận/huyện" });
      setHaveErr(true);
      return;
    } else if (!selectWard) {
      setErr({ ...err, ward: "Vui lòng chọn xã/phường" });
      setHaveErr(true);
      return;
    } else {
      data["id"] = address.id;
      data["province"] = selectProvince.name;
      data["district"] = selectDistrict.name;
      data["ward"] = selectWard.name;
      data["isDefault"] = selectDefault;
      setHaveErr(false);
      mutate(data);
    }
  };

  // Hiển thị lỗi khi submit
  const getErrMess = () => {
    let mess = err.province || err.district || err.ward;
    return (
      <Alert className="my-3" severity="error">
        {mess}
      </Alert>
    );
  };

  // Log để kiểm tra state trước khi render
  console.log("Render - selectProvince:", selectProvince);
  console.log("Render - selectDistrict:", selectDistrict);
  console.log("Render - selectWard:", selectWard);

  return (
    <div>
      <Modal dialogClassName="address-modal" show={show} onHide={closeShow}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa địa chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {haveErr && getErrMess()}

            <Row>
              {formdata.map((item) => (
                <Col key={item.name} lg={6}>
                  <Form.Group className="mb-3" id={`form-${item.name}`}>
                    <Form.Label>
                      {item.label} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="text"
                      name={item.name}
                      placeholder={item.label}
                      isInvalid={Boolean(errors[item.name])}
                      {...register(item.name)}
                    />
                    {errors[item.name] && (
                      <Form.Control.Feedback type="invalid">
                        {errors[item.name].message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              ))}

              <Col lg={6}>
                <Form.Group className="mb-3" id="form-province">
                  <Form.Label>
                    Chọn tỉnh thành <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="province"
                    aria-label="Default select example"
                    onChange={handleSelectProvince}
                    value={selectProvince ? JSON.stringify(selectProvince) : ""}
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {province &&
                      province.map((item) => (
                        <option
                          key={item.id}
                          value={JSON.stringify({ id: item.id, name: item.name })}
                        >
                          {item.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3" id="form-district">
                  <Form.Label>
                    Chọn quận/huyện <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="district"
                    aria-label="Default select example"
                    onChange={handleSelectDistrict}
                    value={selectDistrict ? JSON.stringify(selectDistrict) : ""}
                    disabled={!selectProvince}
                  >
                    <option value="">-- Chọn quận/huyện --</option>
                    {district &&
                      district.map((item) => (
                        <option
                          key={item.id}
                          value={JSON.stringify({ id: item.id, name: item.name })}
                        >
                          {item.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3" id="form-ward">
                  <Form.Label>
                    Chọn xã/phường <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="ward"
                    aria-label="Default select example"
                    onChange={handleSelectWard}
                    value={selectWard ? JSON.stringify(selectWard) : ""}
                    disabled={!selectDistrict}
                  >
                    <option value="">-- Chọn xã/phường --</option>
                    {ward &&
                      ward.map((item) => (
                        <option
                          key={item.id}
                          value={JSON.stringify({ id: item.id, name: item.name })}
                        >
                          {item.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              inline
              label="Chọn làm mặc định"
              name="isDefault"
              type="checkbox"
              checked={selectDefault === 1}
              onChange={handleCheckboxChange}
            />

            <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
              <Button variant="secondary" onClick={closeShow} sx={{ mr: 1 }}>
                Hủy
              </Button>
              <Button
                type="submit"
                sx={{
                  background: "#ffcf20",
                  color: "#1b1b1b",
                  textTransform: "capitalize",
                  borderRadius: "100px",
                }}
                variant="contained"
              >
                Lưu địa chỉ
              </Button>
            </Box>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UpdateAddressModel;