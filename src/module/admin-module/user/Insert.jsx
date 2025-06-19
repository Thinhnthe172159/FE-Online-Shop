import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { fetch } from '../../../api/Fetch';
import { useMutation } from '@tanstack/react-query';
import { InsertShopOwner } from '../../../api/ShopOwnerApi';
import { queryClient } from '../../../main';

export default function Insert() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    if (!isOpen) {
      setShopOwner({
        ...shopOwner, password: generatePassword()
      })
    }
    setIsOpen(!isOpen);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = '';
    password += chars.charAt(Math.floor(Math.random() * 26 + 26)); // 1 uppercase
    password += chars.charAt(Math.floor(Math.random() * 26)); // 1 lowercase
    password += chars.charAt(Math.floor(Math.random() * 10 + 62)); // 1 special character
    password += chars.charAt(Math.floor(Math.random() * 10 + 52)); // 1 number
    for (let i = 4; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length)); // 4 random
    }
    return password.split('').sort(() => 0.5 - Math.random()).join(''); // shuffle
  };



  console.log(generatePassword());

  const [err, setErr] = useState(null)
  const [shopOwner, setShopOwner] = useState({
    email: "",
    password: "",
  })


  const onsubmit = (e, value) => {
    e.preventDefault();
    console.log(shopOwner);
    if (shopOwner.email === "") {
      setErr("Please enter email")
      return
    }
    else if (!shopOwner.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
      setErr("Please enter valid email")
      return
    }
    else {
      setErr(null)
      mutate(shopOwner)
    }
  }


  const { mutate } = useMutation({
    mutationFn: (data) => InsertShopOwner(data),
    onSuccess: () => {

      queryClient.refetchQueries(["shopOwner"])
      setIsOpen(false);
      Swal.fire({
        icon: "success",
        title: "Thêm tài khoản thành công",
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      });
    },
    onError: (err) => {
      console.log(err.response.data.message);
      setErr(err.response.data.message)
    }
  })

  const handleChange = (e) => {
    setShopOwner({
      ...shopOwner,
      [e.target.name]: e.target.value
    })
  }




  return (
    <div>
      <Button variant="contained" onClick={toggleForm}>Thêm tài khoản</Button>

      <Dialog open={isOpen} onClose={toggleForm} fullWidth maxWidth="sm">
        <DialogTitle>Thêm Tài Khoản</DialogTitle>
        <DialogContent>
          <Form onSubmit={onsubmit} >
            {err != null ? <Alert severity="error">{err}</Alert> : null}
            <TextField onChange={handleChange} value={shopOwner.email} name='email' autoFocus margin="dense" label="Tên tài khoản" type="text" fullWidth />
            <TextField value={shopOwner.password} disabled autoFocus margin="dense" label="Mật khẩu" type="password" fullWidth />
            <DialogActions>
              <Button onClick={toggleForm} color="primary">Hủy</Button>
              <Button type='submit' color="primary">Gửi</Button>
            </DialogActions>
          </Form>
        </DialogContent>


      </Dialog>

    </div >
  );
}

