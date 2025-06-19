import React from "react";
import { Form, Modal } from "react-bootstrap";
import "./product.scss";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { cancelOrder } from "../../../api/orderCancelApi";
import { queryClient } from "../../../main";
import { updateStatus } from "../../../api/ProductApi";

const ModalCancelProduct = ({ shopId, productId, show, handleClose }) => {
  const [response, setResponse] = useState("");



  const {mutate:reject} = useMutation({
    mutationFn:(data) => updateStatus(data),
    onSuccess: ()=>{
        queryClient.refetchQueries(["product-shop"])
        handleClose()
        Swal.fire({
            icon:"success",
            text:"Đã từ chối sản phẩm"
        })
    },
    onError:(e)=>{
        console.log(e);
        Swal.fire({
            icon:"error",
            text:"Vui lòng thử lại sau"
        })
        
    }
})
  
  const handleReject = () => {
    if (response == "") {
        Swal.fire({
          icon: "error",
          text: "Vui lòng nhập lý do",
        });
      }
    else{
        let a = {
            reportContent: "Yêu cầu duyệt sản phẩm ",
            reportResponse: response,
            typeId: 2,
            id:shopId,
          };
      
          let data={
              content: a,
              id: productId,
              status:3
          }

          reject(data)
          
    }
  };

 

  return (
    <Modal show={show} centered dialogClassName="save-transaction-modal">
      <Modal.Header closeButton>
        <Modal.Title>Lý do từ chối </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction={"column"} spacing={2}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Phản hồi của bạn đến cửa hàng :</Form.Label>
            <Form.Control
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              as="textarea"
              rows={3}
            />
          </Form.Group>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleClose}
          sx={{ mr: 2 }}
          color="warning"
          variant="contained"
        >
          Hủy
        </Button>
        <Button onClick={handleReject} color="error" variant="contained">
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCancelProduct;
