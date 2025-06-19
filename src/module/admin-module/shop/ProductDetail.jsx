import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Tabs,
  Tab,
} from "@mui/material";
import TabPanel from "../../seller-module/product/ProductPanel"; // Import TabPanel from separate file
import { Container } from "react-bootstrap";
import "./product.scss";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { updateStatus } from "../../../api/ProductApi";
import { queryClient } from "../../../main";
import ModalCancel from "./ModalCancel";
import ModalCancelProduct from "./ModelCancelProduct";

const ProductDetail = ({ data }) => {

  const [show,setShow] = useState(false)
  const handleClose = () =>{
    setShow(false)
  }
  
    let {id} = data

    
    
  const [value, setValue] = useState(0);

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const categoryNames = data.categories
    .map((category) => category.name)
    .join(", ");

    const {mutate:approve} = useMutation({
        mutationFn:() => updateStatus({id,status:1}),
        onSuccess: ()=>{
            queryClient.refetchQueries(["product-shop"])
            Swal.fire({
                icon:"success",
                text:"Đã phê duyệt sản phẩm"
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

    const {mutate:reject} = useMutation({
      mutationFn:() => updateStatus({id,status:3}),
      onSuccess: ()=>{
          queryClient.refetchQueries(["product-shop"])
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

  const handleApprove = () =>{
    if(data.status == 1){
        Swal.fire({
            icon:"warning",
            text:"Sản phẩm đã được phê duyệt"
        })
    }
    else{
        Swal.fire({
            icon:"question",
            text:"Bạn muốn sản phẩm này được phê duyệt",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonText:"Đồng ý",
            cancelButtonText:"Hủy"
        }).then((result) =>{
            if(result.isConfirmed){
              approve()
            }
        })
    }
  }



  const handleReject = () =>{
    if(data.status == 3){
        Swal.fire({
            icon:"warning",
            text:"Sản phẩm đã được phê duyệt"
        })
    }
    else{
        Swal.fire({
            icon:"question",
            text:"Bạn muốn từ chối sản phẩm này",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonText:"Đồng ý",
            cancelButtonText:"Hủy"
        }).then((result) =>{
            if(result.isConfirmed){
                reject()
            }
        })
    }
  }

  return (
    <div id="seller-table-product">
      <ModalCancelProduct productId={data.id} shopId={data.shop.id} show={show} handleClose={handleClose}></ModalCancelProduct>
      <Box margin={1}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{ textTransform: "capitalize" }}
            label="Thông tin sản phẩm"
          />
          <Tab sx={{ textTransform: "capitalize" }} label="Số lượng còn lại" />
          <Tab sx={{ textTransform: "capitalize" }} label="Tiện ích bổ sung" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Stack sx={{ alignItems: "start" }} direction={"row"} spacing={5}>
            <Box sx={{ width: "40%" }} className="product-avatar">
              <img className="product-avatar-img" src={data.avatar} alt="" />{" "}
              {/* Removed value */}
            </Box>
            <Box className="product-info" sx={{ width: "60%" }}>
              <Stack
                className="product-info-item"
                direction={"row"}
                spacing={3}
              >
                <p className="product-name">Tên sản phẩm:</p>
                <p>{data.name}</p> {/* Removed value */}
              </Stack>
              <Stack
                className="product-info-item"
                direction={"row"}
                spacing={3}
              >
                <p className="product-name">Giá sản phẩm:</p>
                <p>{formatCurrency(data.price)}</p> {/* Removed value */}
              </Stack>
              <Stack
                className="product-info-item"
                direction={"row"}
                spacing={3}
              >
                <p className="product-name">Thể loại:</p>
                <p>{categoryNames}</p> {/* Removed value */}
              </Stack>
      
              <Stack
                className="product-info-item"
                direction={"row"}
                spacing={3}
              >
                <p className="product-name">Kích thước:</p>
                <p>{`${data.width}cm x ${data.length}cm x ${data.height}cm`}</p>{" "}
                {/* Removed value */}
              </Stack>

              <Stack
                className="product-info-item"
                direction={"row"}
                spacing={3}
              >
                <p className="product-name">Trọng lượng:</p>
                <p>{data.weight} gram</p> {/* Removed value */}
              </Stack>
              <Stack
                className="product-info-item"
                direction={"row"}
                spacing={3}
              >
                <p className="product-name">Ngày tạo:</p>
                <p>{data.create_at}</p> {/* Removed value */}
              </Stack>
              <Stack
                className="mt-5"
                direction={"row"}
                spacing={2}
                sx={{ justifyContent: "end" }}
              >
                <Button onClick={handleApprove} color="success" variant="contained">
                  Duyệt sản phẩm
                </Button>
                <Button onClick={()=>setShow(true)} color="error" variant="contained">
                  Từ chối
                </Button>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container>
            <TableContainer sx={{ width: "600px" }} component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên lựa chọn</TableCell>
                    <TableCell>Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Table body logic */}
                  {data.options.map((item) => {
                    return (
                      <TableRow>
                        <TableCell>{item.name}</TableCell> {/* Removed value */}
                        <TableCell>{item.quantity}</TableCell> {/* Removed value */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container>
            <TableContainer sx={{ width: "600px" }} component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên tiện ích</TableCell>
                    <TableCell>Giá tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Table body logic */}
                  {data.addOns.map((item) => {
                    return (
                      <TableRow>
                        <TableCell>{item.name}</TableCell> {/* Removed value */}
                        <TableCell>{item.price}</TableCell> {/* Removed value */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </TabPanel>
      </Box>
    </div>
  );
};

export default ProductDetail;
