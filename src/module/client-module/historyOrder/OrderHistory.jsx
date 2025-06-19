import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getOrderHistory } from '../../../api/orderApi';
import AllOrderHistory from './AllOrderHistory';
import Loading from '../loading/Loading';

const OrderHistory = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["all-history"],
        queryFn: () =>  getOrderHistory("all"),
      });

      console.log(data);
      
    
      if(isLoading){
        return <Loading></Loading>
      }
  return (
    <AllOrderHistory data={data}></AllOrderHistory>
  )
}

export default OrderHistory