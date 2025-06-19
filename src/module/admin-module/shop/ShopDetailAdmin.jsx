import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ShopProduct from './ShopProduct';
import { useParams } from 'react-router-dom';
import Loading from '../../client-module/loading/Loading';
import { useQuery } from '@tanstack/react-query';
import { getProductByShop, getShopAdmin } from '../../../api/shopApi';
import {getAdminTransactionByShop} from "../../../api/transactionApi"
import ShopTransaction from './ShopTransaction';
import OrderCancel from './OrderCancel';
import { getRequest } from '../../../api/orderCancelApi';
import ShopDetailStatus from './ShopDetailStatus';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ShopDetailAdmin() {
    const {id} = useParams()
    const { data, isLoading } = useQuery({
        queryKey: ["product-shop"],
        queryFn: () => getProductByShop(id),
      });

   
     
     const {data: transaction, Loading:transactionLoading} = useQuery({
        queryKey:['admin-transaction'],
        queryFn: ()=> getAdminTransactionByShop(id)
     })

     
     const {data:order, Loading:orderLoading} = useQuery({
        queryKey:['admin-order'],
        queryFn: () => getRequest(id)
     })
     
     const {data:shopDetail , isLoading:loadingShopDetail} = useQuery({
      queryKey:['admin-shop-detail'],
      queryFn: () => getShopAdmin(id)
     })
     
     console.log(shopDetail);
     
      

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if(isLoading || orderLoading || transactionLoading || loadingShopDetail ){
    return <Loading></Loading>
  }
  return (
    <Box sx={{ width: '100%' }}>
        
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{textTransform:"initial"}} label="Danh sách sản phẩm" {...a11yProps(0)} />
          <Tab  sx={{textTransform:"initial"}} label="Yêu cầu hủy đơn" {...a11yProps(1)} />
          <Tab  sx={{textTransform:"initial"}} label="Thông tin và trạng thái cửa hàng" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ShopProduct data={data}></ShopProduct>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <OrderCancel order={order}></OrderCancel>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ShopDetailStatus shop={shopDetail}></ShopDetailStatus>
      </CustomTabPanel>
    </Box>
  );
}
