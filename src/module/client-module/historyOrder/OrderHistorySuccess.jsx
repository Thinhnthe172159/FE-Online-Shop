import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getOrderHistory } from '../../../api/orderApi';
import Loading from '../loading/Loading';
import AllOrderHistory from './AllOrderHistory';

const OrderHistorySuccess = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["all-history"],
        queryFn: () =>  getOrderHistory("shipped"),
      });

      console.log(data);
      
    
      if(isLoading){
        return <Loading></Loading>
      }
  return (
    <AllOrderHistory data={data}></AllOrderHistory>
  )
}

export default OrderHistorySuccess