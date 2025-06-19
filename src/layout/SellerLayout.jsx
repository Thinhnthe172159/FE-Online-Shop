import React, { useEffect, useState } from "react";
import SellerHeader from "../components/seller/SellerHeader";
import SelllerFooter from "../components/seller/SelllerFooter";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetch } from "../api/Fetch";
import Loading from "../module/client-module/loading/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getShop } from "../api/shopApi";
import { getSeenReportShop, saveSeenReportShop } from "../api/reportAip";
import ReportModal from "./ReportModal";

const SellerLayout = () => {
  const [show, setShow] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  if (auth.login) {
    if (auth.role != "shopOwner") {
      return <Navigate to={"/"}></Navigate>;
    }
  } else {
    return <Navigate to={"/"}></Navigate>;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getShop"],
    queryFn: getShop,
    retry: 1,
  });
  const { data: notify, isLoading: notifyLoading } = useQuery({
    queryKey: ["getSeen"],
    queryFn: getSeenReportShop,
    enabled: auth.login === true, // Chỉ gọi khi auth.login = true
    retry: 0,
  });
  useEffect(() => {
    if(notify && notify.length > 0){
      setShow(true)
    }
  }, [notify])


  console.log(notify);
  
  const {mutate} = useMutation({
    mutationFn:(data) => saveSeenReportShop(data),
    onSuccess: () =>{
        setShow(false)
    }
  })

  const handleSave = () =>
  {
    mutate(notify)
  }
  

  

  if (isLoading || notifyLoading) {
    return <Loading></Loading>;
  } else {
    if (data) {
      return (
        <>
          <ReportModal show={show} handleSave={handleSave} data={notify ? notify.length : 0}></ReportModal>
          <SellerHeader shop={data}></SellerHeader>
          <Outlet shop={data}></Outlet>
          <SelllerFooter></SelllerFooter>
        </>
      );
    } else {
      return <Navigate to={"/set-up"}></Navigate>;
    }
  }
};

export default SellerLayout;
