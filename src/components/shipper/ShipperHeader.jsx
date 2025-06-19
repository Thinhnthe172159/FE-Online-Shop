import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavLink } from "react-router-dom";
import "../seller/SellerHeader.scss";
import StoreIcon from '@mui/icons-material/Store';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SellIcon from '@mui/icons-material/Sell';
import { Stack } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import ChatIcon from '@mui/icons-material/Chat';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useSelector } from "react-redux";

const ShipperHeader = ({shop}) => {
    const auth = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = React.useState(null);
      const [language, setLanguage] = React.useState("vn");
    
      const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    return (
        <>
            <div id="seller-header">
                <div className="seller-header-top">
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar
                            position="static"
                            sx={{ color: "black", backgroundColor: "white" }}
                        >
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <img
                                        width={150}
                                        src="https://res.cloudinary.com/dzq9ac2qd/image/upload/v1742304897/logo_xrx34y.png"
                                        alt="Logo"
                                    />
                                </Typography>
                                <div>
                                    <Box
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        color="inherit"
                                        sx={{
                                            display: "flex",
                                            gap: 3,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            size="large"
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={handleMenu}
                                            color="inherit"
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Stack sx={{ alignItems: "center" }} direction="row" spacing={1} variant="body1" color="initial">
                                                <img src={shop?.logo} style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "50%" }} alt="" />
                                                <Typography fontWeight={500} variant="body1" color="initial">{auth?.email}</Typography>
                                            </Stack>

                                        </Box>
                                    </Box>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        {/* <MenuItem onClick={handleChangePassword}>Trang cá nhân

                                        </MenuItem>

                                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem> */}
                                    </Menu>
                                </div>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </div>

                <div className="seller-header-bottom">
                    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
                        <Toolbar variant="dense" sx={{ justifyContent: "start", gap: 2 }}>
                            <NavLink
                                to="/seller"
                                end
                            >
                                <VisibilityIcon sx={{ marginRight: "5px" }} /> Thông tin cá nhân
                            </NavLink>
                            <NavLink
                                to="/seller/product"
                            >
                                <ShoppingCartIcon sx={{ marginRight: "5px" }} /> Thông tin đơn hàng
                            </NavLink>
                            <NavLink
                                to="/seller/response"
                            >
                                <UndoIcon sx={{ marginRight: "5px" }} /> Báo cáo được phản hồi
                            </NavLink>
                        </Toolbar>
                    </AppBar>
                </div>
            </div>
        </>
    )
}

export default ShipperHeader