import React, { useState } from "react";
import "./product.scss";
import Modal from "react-bootstrap/Modal";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Form} from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { payForShop } from "../../../api/transactionApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
const ModalTransaction = ({show,handleClose, orderCode, amountTotal,fprice,shopId,tid}) => {

    const [description,setDescription] =useState("")

    const handleSave = () =>{
        let data = {
            shopId,
            description,
            code: orderCode,
            amount:fprice,
            tid
        }
        mutate(data)
        
    }

    const {mutate} = useMutation({
        mutationFn:(data) => payForShop(data),
        onSuccess:() => {
            queryClient.refetchQueries(['admin-transaction'])
            handleClose()
            Swal.fire({
                icon:"success",
                text:"Giao dịch đã được lưu"
            })
        } ,
        onError: () => {
            Swal.fire({
                 icon:"error",
                text:"Vui lòng thử lại sau"
            })
        }
    })

  return (
    <Modal centered dialogClassName="save-transaction-modal" onHide={handleClose}  show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận hoàn thành giao dịch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction={"column"} spacing={2} >
          <Typography variant="h7" className="text-center" color="initial">
            Xác nhận bạn đã thanh toán hóa đơn {orderCode} cho cửa hàng Đỏ với số
            tiền là {amountTotal}. <b>Lưu ý</b> :hãy thanh toán cho cửa hàng khi đơn hàng giao <span style={{color:"green"}}><b>thành công</b></span>
            
          </Typography>
          <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Bạn có lời nhắn gì đến cửa hàng không :</Form.Label>
              <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} as="textarea" rows={3} />
            </Form.Group>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} sx={{textTransform:"initial"}} variant="secondary">Hủy</Button>
        <Button onClick={handleSave} sx={{textTransform:"initial"}} variant="contained">Lưu giao dịch</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTransaction;
