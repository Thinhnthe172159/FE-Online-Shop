import React from 'react'
import Typography from "@mui/material/Typography";
import TableAdmin from './TableAdmin';
import InsertAdmin from './InsertAdmin';
const AdminsManager = () => {
    return (
        <section id='admin-admins'>
            <Typography variant="h5" color="initial">
                Quản lý Quản trị viên
            </Typography>
            <InsertAdmin />
            <TableAdmin />
        </section>
    )
}

export default AdminsManager
