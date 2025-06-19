import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import Loading from "../../client-module/loading/Loading";
import { Container } from "react-bootstrap";
import { getShopTransaction } from "../../../api/transactionApi";
import HistoryTransaction from "./HistoryTransaction";

const Transaction = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { data,isLoading } = useQuery({
    queryKey: ["shop-transaction"],
    queryFn: getShopTransaction,
  });
  
  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <Container>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Transaction tabs"
          centered
        >
          <Tab sx={{ textTransform: "initial" }} label="Lịch sử giao dịch" />
          
        </Tabs>

        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            <HistoryTransaction data={data}></HistoryTransaction>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">Pending Transactions</Typography>
            {/* Content for Pending Transactions */}
            <Typography>Here are the pending transactions.</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Transaction;
