import React, { useEffect, useState } from 'react'
import ClientHeader from '../components/client/ClientHeader'
import ClientFooter from '../components/client/ClientFooter'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSeenReport, saveSeenReport } from '../api/reportAip'
import ReportModal from './ReportModal'
import Loading from '../module/client-module/loading/Loading'

const ClientLayout = () => {

  const auth = useSelector((state) => state.auth);
  const [show,setShow] = useState(false)

  const { data,isLoading } = useQuery({
    queryKey: ['getSeen'],
    queryFn: getSeenReport,
    enabled: auth.login === true, // Chỉ gọi khi auth.login = true
    retry:0
  });

  useEffect(() => {
    if(data && data.length > 0){
      setShow(true)
    }
  }, [data])


  const {mutate} = useMutation({
    mutationFn:(data) => saveSeenReport(data),
    onSuccess: () =>{
        setShow(false)
    }
  })

  const handleSave = () =>
  {
    mutate(data)
  }
  
  
  
  if(auth.role == "shopOwner"){
      return <Navigate to={"/seller"}></Navigate>
  }
  if(auth.role== "admin" || auth.role == "superAdmin"){
    return <Navigate to={"/admin"}></Navigate>
  }

  if(isLoading){
    return <Loading></Loading>
  }
  
  return (
    <>
        <ReportModal show={show} handleSave={handleSave} data={data ? data.length : 0}></ReportModal>
        <ClientHeader ></ClientHeader>
        <Outlet></Outlet>
        <ClientFooter></ClientFooter>
    </>
  )
}

export default ClientLayout