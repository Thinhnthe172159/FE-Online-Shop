import React from "react";
import { Form, Modal } from "react-bootstrap";
import "./product.scss";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { cancelOrder } from "../../../api/orderCancelApi";
const ModalCancel = ({ shopId,type, show, content, handleClose,id }) => {
    console.log(shopId);
    
  const [response, setResponse] = useState("")
    let handleSubmit = () =>{
        if(response == ""){
            Swal.fire({
                icon:"error",
                text:"Vui lòng nhập lý do"
            })
        }
        else{
            let a ={
                reportContent: content,
                reportResponse: response,
                typeId: type,
                id
            }

            let data = {
                content: a,
                sid: shopId
            }
            console.log(data);
            

            mutate(data)
            
        }
    }
    const {mutate} = useMutation({
        mutationFn:(data) => cancelOrder(data),
        onSuccess:() => {
          
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
        <Button onClick={handleClose} sx={{mr:2}} color="warning" variant="contained" >
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="error" variant="contained" >
          Lưu 
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCancel;
