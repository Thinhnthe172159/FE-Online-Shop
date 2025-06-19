import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, TextareaAutosize, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { sendMailApi } from "../../../api/shopRegisterApi";
import Loading from "../../client-module/loading/Loading";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};
const ModalEmail = ({email, show, handleClose, subject}) => {

  const {mutate,isPending} = useMutation({
    mutationFn:(data) =>  sendMailApi(data),
    onSuccess:() =>{
      handleClose()
      Swal.fire({
        icon:"success",
        text:"Gửi mail thành công"
      })
    },
    onError: () =>{
      handleClose()
      Swal.fire({
        icon:"error",
        text:"Vui lòng thử lại sau"
      })
    }
  })

  const [text, setText] = useState("")
  const handleSubmit = () =>{
    if(text == ""){
      Swal.fire({
        icon:"error",
        text:"Vui lòng thêm nội dung"
      })
    }
    else{
      let data = {
        email,
        subject,
        content:text
      }
      mutate(data)
    }
  }
  if(isPending){
    return <Loading></Loading>
  }
  return (
    <Modal
      open={show}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Gửi mail đến {email}
        </Typography>
        <Stack className="mt-3">
          <TextField onChange={(e) => setText(e.target.value)} id="" label="Nội dung" multiline maxRows={4} minRows={3} />
          <Stack direction={"row"} spacing={1} sx={{justifyContent:"end", mt:3}}>
                <Button onClick={handleClose} variant="contained">Hủy</Button>
                <Button variant="outlined" onClick={handleSubmit}>Gửi mail</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalEmail;
