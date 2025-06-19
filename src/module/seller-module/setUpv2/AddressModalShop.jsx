import React, { useEffect, useState } from "react";
import { Alert, Box, Button } from "@mui/material";
import { Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";

const AddressModelShop = ({ show, handleClose ,addAddress}) => {
  const [data, setData] = useState({
    selectProvince: null,
    selectDistrict: null,
    selectWard: null,
    detail: "", // Field cho địa chỉ chi tiết
    listDistrict: [],
    listWard: [],
  });

  const [province, setProvince] = useState([]);
  const [error, setError] = useState(null); // State lỗi

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => setProvince(response.data.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh thành
  useEffect(() => {
    if (data.selectProvince) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${data.selectProvince.id}.htm`)
        .then((response) =>
          setData((prevData) => ({
            ...prevData,
            listDistrict: response.data.data,
            selectDistrict: null,
            listWard: [],
          }))
        )
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [data.selectProvince]);

  // Lấy danh sách xã/phường khi chọn quận/huyện
  useEffect(() => {
    if (data.selectDistrict) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${data.selectDistrict.id}.htm`)
        .then((response) =>
          setData((prevData) => ({
            ...prevData,
            listWard: response.data.data,
            selectWard: null,
          }))
        )
        .catch((error) => console.error("Error fetching wards:", error));
    }
  }, [data.selectDistrict]);

  // Xử lý khi chọn tỉnh thành
  const handleSelectProvince = (e) => {
    const value = e.target.value;
    if (value === "") {
      setData((prevData) => ({
        ...prevData,
        selectProvince: null,
        selectDistrict: null,
        selectWard: null,
        listDistrict: [],
        listWard: [],
      }));
    } else {
      const selectedProvince = JSON.parse(value);
      setData((prevData) => ({
        ...prevData,
        selectProvince: selectedProvince,
        selectDistrict: null,
        selectWard: null,
        listDistrict: [],
        listWard: [],
      }));
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleSelectDistrict = (e) => {
    const value = e.target.value;
    if (value === "") {
      setData((prevData) => ({
        ...prevData,
        selectDistrict: null,
        selectWard: null,
        listWard: [],
      }));
    } else {
      const selectedDistrict = JSON.parse(value);
      setData((prevData) => ({
        ...prevData,
        selectDistrict: selectedDistrict,
        selectWard: null,
        listWard: [],
      }));
    }
  };

  // Xử lý khi chọn xã/phường
  const handleSelectWard = (e) => {
    const value = e.target.value;
    if (value === "") {
      setData((prevData) => ({
        ...prevData,
        selectWard: null,
      }));
    } else {
      const selectedWard = JSON.parse(value);
      setData((prevData) => ({
        ...prevData,
        selectWard: selectedWard,
      }));
    }
  };

  // Xử lý khi thay đổi địa chỉ chi tiết
  const handleDetailChange = (e) => {
    setData((prevData) => ({ ...prevData, detail: e.target.value }));
  };

  // Xử lý khi bấm nút Thêm địa chỉ
  const handleAddAddress = () => {
    // Kiểm tra các trường dữ liệu
    if (!data.selectProvince) {
      setError("Tỉnh thành không được để trống");
      return;
    }
    if (!data.selectDistrict) {
      setError("Quận/huyện không được để trống");
      return;
    }
    if (!data.selectWard) {
      setError("Xã/phường không được để trống");
      return;
    }
    if (!data.detail.trim()) {
      setError("Địa chỉ chi tiết không được để trống");
      return;
    }

    // Nếu không có lỗi, tạo đối tượng và log ra data
    setError(null);
    const result = {
      province: data.selectProvince.name,
      district: data.selectDistrict.name,
      ward: data.selectWard.name,
      addressDetail: data.detail.trim(),
    };
   addAddress(result)
   handleClose()
  };

  return (
    <div>
      <Modal
        onHide={handleClose}
        show={show}
        size="lg"
        dialogClassName="address-modal"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Thêm địa chỉ mới
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Hiển thị lỗi nếu có */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Row className="mt-3">
              {/* Chọn tỉnh thành */}
              <Col lg={6}>
                <Form.Group className="mb-3" id="form-province">
                  <Form.Label>
                    Chọn tỉnh thành <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={handleSelectProvince}
                    aria-label="Chọn tỉnh thành"
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {province.map((item) => (
                      <option key={item.id} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Chọn quận/huyện */}
              <Col lg={6}>
                <Form.Group className="mb-3" id="form-district">
                  <Form.Label>
                    Chọn quận/huyện <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={handleSelectDistrict}
                    aria-label="Chọn quận/huyện"
                  >
                    <option value="">-- Chọn quận huyện --</option>
                    {data.listDistrict.map((item) => (
                      <option key={item.id} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Chọn xã/phường */}
              <Col lg={6}>
                <Form.Group className="mb-3" id="form-ward">
                  <Form.Label>
                    Chọn xã/phường <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={handleSelectWard}
                    aria-label="Chọn xã/phường"
                  >
                    <option value="">-- Chọn xã phường --</option>
                    {data.listWard.map((item) => (
                      <option key={item.id} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Nhập địa chỉ */}
              <Col lg={6}>
                <Form.Group className="mb-3" id="form-address">
                  <Form.Label>
                    Nhập địa chỉ <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    className="custom-input"
                    type="text"
                    value={data.detail}
                    onChange={handleDetailChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 3 }}>
              <Button variant="secondary" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "100px",
                }}
                variant="contained"
                onClick={handleAddAddress} // Gọi hàm thêm địa chỉ
              >
                Thêm địa chỉ
              </Button>
            </Box>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddressModelShop;
