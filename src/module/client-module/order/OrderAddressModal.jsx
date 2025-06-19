import { Box, Button, Stack } from "@mui/material";
import React from "react";
import { Form } from "react-bootstrap";

import Modal from "react-bootstrap/Modal";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
const OrderAddressModal = ({
  handleClose,
  show,
  address,
  addressSelect,
  handleChangeAddress,
}) => {
  return (
    <div>
      <Modal dialogClassName="order-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lựa chọn địa chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {address.map((item) => {
            return (
              <Stack
                className="mx-2 mb-3"
                direction={"row"}
                spacing={2}
                sx={{ alignItems: "center", justifyContent: "center" }}
              >
                <Form.Check
                  onChange={() => handleChangeAddress(item.id)}
                  className="custom-radio"
                  inline
                  name="group1"
                  type="radio"
                  value={addressSelect && item.id}
                  checked={addressSelect && item.id == addressSelect.id}
                />
                <Box
                  sx={{
                    width: "90%",
                    minHeight: "100px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <Stack className="mx-2">
                    <h6>
                      <PlaceOutlinedIcon
                        sx={{ color: " #ffcf20" }}
                      ></PlaceOutlinedIcon>{" "}
                      {item.name}
                    </h6>
                    <Stack className="mx-3">
                      <Stack
                        className="mb-1"
                        direction={"row"}
                        sx={{ alignItems: "center" }}
                        spacing={1}
                      >
                        <p className="mb-0">{item.nameReceiver}</p>
                        <FiberManualRecordIcon
                          sx={{ fontSize: "15px", color: "#e7e7e7" }}
                        />
                        <p className="mb-0">{item.phone}</p>
                      </Stack>
                      <p className="order-address-detail">{item.address}</p>
                      <p className="order-address-detail">{`${item.ward}, ${item.district}, ${item.province}`}</p>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Huy
          </Button>
          <Button
            sx={{
              background: " #ffcf20",
              color: "#1b1b1b",
              textTransform: "capitalize",
              borderRadius: "100px",
            }}
            variant="primary"
            onClick={handleClose}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderAddressModal;
