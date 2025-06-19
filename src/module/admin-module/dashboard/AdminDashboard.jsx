import React from "react";
import { Container, Grid } from "@mui/material";
import TotalEarning from "./TotalEarning";
import GrowthChart from "./GrowthChart";
import PopularStocks from "./PopularStocks";
import TotalOrder from "./TotalOrder";
import TotalIncome from "./TotalIncome";
import { useQuery } from "@tanstack/react-query";
import { getAdminTransaction, getDaily, getIncomeDay } from "../../../api/transactionApi";
import Loading from "../../client-module/loading/Loading";
import NewRegister from "./NewRegister";
import { countRegister, getAllRegister } from "../../../api/shopRegisterApi";
import { getCountActive } from "../../../api/shopApi";

const AdminDashboard = () => {

  const{data:transaction, Loading: trasactionLoading} = useQuery({
    queryKey:['all-transation'],
    queryFn: getAdminTransaction
  })

  const {data,isLoading} = useQuery({
    queryKey:['get-daily'],
    queryFn:getDaily
  })

  const {data:income , Loading: incomeLoading} = useQuery({
    queryKey:['day-income'],
    queryFn: getIncomeDay
  })
  const { data:register, isLoading: registerLoading } = useQuery({
    queryKey: ["shop-register-all"],
    queryFn: getAllRegister,
  });

  const { data:count, isLoading: countLoading } = useQuery({
    queryKey: ["shop-register-count"],
    queryFn: getCountActive,
  });
  
  const { data:count1, isLoading: count1Loading } = useQuery({
    queryKey: ["shop-register-count1"],
    queryFn: countRegister,
  });

  console.log(count1);
  


  if(isLoading || incomeLoading || trasactionLoading ||  registerLoading){
    return <Loading></Loading>
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb:7 }}>
      <Grid container spacing={3}>
        {/* Total Earning */}
        <Grid item xs={12} sm={6} md={4}>
          <TotalEarning amount={income} />
        </Grid>

        {/* Total Order */}
        <Grid item xs={12} sm={6} md={4}>
          <TotalOrder amount={count} />
        </Grid>

        {/* Total Income */}
        <Grid item xs={12} sm={6} md={4}>
          <TotalIncome  amount={count1} />
        </Grid>

        {/* Growth Chart */}
        <Grid item xs={12} md={8}>
          <GrowthChart data={data} />
        </Grid>

        {/* Popular Stocks */}
        <Grid item xs={12} md={4}>
          <PopularStocks transaction={transaction} />
        </Grid>

       
          
       
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
