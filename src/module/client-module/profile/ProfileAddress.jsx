import React, { useState } from "react";
import "./profile.scss";
import { Box, Button, Stack } from "@mui/material";
import AddAdressModal from "./AddAdressModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteAddress, getAllAddress } from "../../../api/addressApi";
import Loading from "../loading/Loading";
import { queryClient } from "../../../main";
import Swal from "sweetalert2";
import UpdateAddressModel from "./UpdateAddressModel";

const ProfileAddress = () => {
  let { data: addressData, isLoading } = useQuery({
    queryKey: ["get-add-address"],
    queryFn: getAllAddress,
  });

  let{mutate} = useMutation({
      mutationFn: (id) => deleteAddress(id),
      onSuccess: () => {
        queryClient.refetchQueries(["get-add-address"])
        Swal.fire({
          icon: "success",
          confirmButtonColor:"#28a745",
          title: "Xóa địa chỉ thành công",
          confirmButtonText: "Trở lại",
      })
      },
      onError:() => {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          confirmButtonText: "Trở lại",
          confirmButtonColor:"red"
      })
      }
  })

  let [show, setShow] = useState(false);
  let [showUpdate, setShowUpdate] = useState(false)
  let [selectUpdate,setSelectUpdate] = useState(null)
  console.log(selectUpdate)
  const openModal = () => {
    setShow(true);
  };

  const closeShow = () => {
    setShow(false);
  };

  const handleShowUpdate = (item) => {
      setSelectUpdate(item)
      setShowUpdate(true)
  }
  const handleCloseUpdate = () => {
    setSelectUpdate(null)
      setShowUpdate(false)
  }
  
  

  const handleDelete = (id) =>{
    Swal.fire({
      title: "Xóa địa chỉ",
      text: "Bạn chắc chắn muốn xóa",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận xóa",
      cancelButtonText:"Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(id)
      }
    });
    
  }

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div id="account-address">
      <div className="address-head mb-3">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 className="mb-0">Địa chỉ</h4>
          <p onClick={openModal} className="mb-0">
            + Thêm địa chỉ mới
          </p>
        </Box>
      </div>

      {addressData.map((item) => {
        return (
          <div key={item.id} className="address-head mb-3">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction={"column"} spacing={1}>
                <h6 className="mb-0">{item.name}</h6>
                {item.isDefault == 1 ? <p id="isDefault">Địa chỉ mặc định</p> : ""}
              </Stack>
              <Stack direction={"row"} spacing={2}>
              <Button
                type="button"
                onClick={() => handleShowUpdate(item)}
                sx={{
                  backgroundColor: "white",
                  color: "#ffcf20",
                  borderRadius: "999px",
                  textTransform: "capitalize",
                  borderColor: "#ffcf20",
                  border: "1px solid #ffcf20",
                }}
              >
                <b>Chỉnh sửa địa chỉ</b>
              </Button>

              <Button
                type="button"
                onClick={() => handleDelete(item.id)}
                sx={{
                  backgroundColor: "white",
                  color: "red",
                  borderRadius: "999px",
                  textTransform: "capitalize",
                  border: "1px solid red",
                }}
              >
                <b>Xóa địa chỉ</b>
              </Button>
              </Stack>
            </Box>
          </div>
        );
      })}
      <AddAdressModal show={show} closeShow={closeShow}></AddAdressModal>
     {selectUpdate  ?  <UpdateAddressModel address={selectUpdate} show={showUpdate} closeShow={handleCloseUpdate}></UpdateAddressModel>:""}
    </div>
  );
};

export default ProfileAddress;
