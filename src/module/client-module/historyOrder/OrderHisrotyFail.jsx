import React from 'react'
import { getOrderHistory } from '../../../api/orderApi';
import { useQuery } from '@tanstack/react-query';
import AllOrderHistory from './AllOrderHistory';
import Loading from '../loading/Loading';

const OrderHistoryCancel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["all-history"],
        queryFn: () =>  getOrderHistory("fail"),
      });
    
      if(isLoading){
        return <Loading></Loading>
      }
  return (
    <AllOrderHistory data={data}></AllOrderHistory>
  )
}

export default OrderHistoryCancel