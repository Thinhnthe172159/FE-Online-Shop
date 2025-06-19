import React from 'react'
import Typography from "@mui/material/Typography";
import TableCustomer from './TableCustomer';
import InsertCustomer from './InsertCustomer';
const Customer = () => {
    return (
        <section id='admin-customer'>
            <Typography variant="h5" color="initial">
                Quản lý khách hàng
            </Typography>
            <InsertCustomer />
            <TableCustomer />
        </section>
    )
}

export default Customer
