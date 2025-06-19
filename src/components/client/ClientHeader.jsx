import { Row, Col, Container } from "react-bootstrap";
import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import { Avatar, Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { LOGOUT } from "../../redux/slice/AuthSlice";
import Loading from "../../module/client-module/loading/Loading";
import { getUserDetail } from "../../api/customerApi";
import { getTotalItem, getTotalItemFromFavourite } from "../../api/cartApi";
import SearchFunction from "./SearchFunction";
import SearchBar from "./SearchBar";
import ChatIcon from "@mui/icons-material/Chat";
const ClientHeader = () => {
  const languageData = [
    {
      label: "Tiếng việt",
      icon: "../../../public/vietnam.png",
      value: "vn",
    },
    {
      label: "Tiếng Anh",
      icon: "../../../public/english.png",
      value: "en",
    },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.auth.login);
  const [anchorEl, setAnchorEl] = React.useState();
  const [language, setLanguage] = React.useState("vn");
  const [logoutLoad, setLogoutLoad] = useState(false);
  const {
    data: userdetail,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userdetail"],
    queryFn: getUserDetail,
    enabled: login,
    retry: 1,
  });

  const {
    data: totalFavourites,
    isLoading: favouriteLoading,
    isError: favouriteError,
    refetch: favouriteRefetch,
  } = useQuery({
    queryKey: ["totalFavourites"],
    queryFn: getTotalItemFromFavourite,
    enabled: login,
    retry: 1,
  });

  const {
    data: totalItem,
    isLoading: totalLoading,
    isError: totalErr,
    refetch: totalRefetch,
  } = useQuery({
    queryKey: ["totalItem"],
    queryFn: getTotalItem,
    enabled: login,
    retry: 1,
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };
  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const goToProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const logout = async () => {
    dispatch(LOGOUT());
    setLogoutLoad(true);
    await refetch();
    await totalRefetch();
    await favouriteRefetch();
    setLogoutLoad(false);
    navigate("/");
    handleClose();
    window.location.reload;
  };

  if (isLoading || logoutLoad || totalLoading || favouriteLoading) {
    return <Loading></Loading>;
  }
  return (
    <header>
      <div className="header-top"></div>
      <div
        className="header-bottom pb-1"
        style={{
          backgroundColor: "#000",
          color: "#b6b6b6",
          paddingTop: "25px",
        }}
      >
        <Container style={{ width: "80%" }}>
          <Row>
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Stack
                  direction={"row"}
                  gap={1}
                  divider={<FiberManualRecordIcon sx={{ fontSize: "10px" }} />}
                  sx={{
                    alignItems: "center",
                    color: "#b6b6b6",
                  }}
                >
                  <FormControl sx={{ m: 1, minWidth: 200, color: "#b6b6b6" }}>
                    <Select
                      IconComponent={(props) => (
                        <ArrowDropDownIcon
                          {...props}
                          style={{ color: "#b6b6b6" }} // Change this to any color you want
                        />
                      )}
                      sx={{ height: "30px", color: "#b6b6b6", width: "135px" }}
                      color="none"
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={language}
                      onChange={changeLanguage}
                      variant="standard"
                      // inputProps={{ "aria-label": "Without label" }}
                    >
                      {languageData.map((item) => {
                        return (
                          <MenuItem key={item.value} value={item.value}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <img
                                width={30}
                                height={25}
                                src={item.icon}
                                alt=""
                              />
                              <p className="mb-0 mx-2">{item.label}</p>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
              <Box
                sx={{ width: "30%", display: "flex", justifyContent: "center" }}
              >
                <Link to={"/"}>
                  <img
                    src="../../public/logo.png"
                    alt="Logo trang chủ"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      objectFit: "contain",
                      // paddingRight: "120px",
                    }}
                  />
                </Link>
              </Box>
              <Box sx={{ width: "30%" }}>
                {userdetail && !isError ? (
                 
                     
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <IconButton
                        size="small"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        sx={{
                          fontWeight: "600",
                          fontSize: "15px",
                        }}
                      >
                        <Avatar
                          sx={{ marginRight: "5px" }}
                          alt="Remy Sharp"
                          sizes="small"
                          src={userdetail.avatar}
                        />
                        {userdetail.name}
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        sx={{
                          top: "40px",
                        }}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={goToProfile}>Hồ sơ cá nhân</MenuItem>
                        <MenuItem onClick={logout}>Đăng xuất</MenuItem>
                      </Menu>
                    </div>
                  
                ) : (
                  <Stack
                    sx={{ alignItems: "center", justifyContent: "end" }}
                    direction={"row"}
                    gap={1}
                    divider={
                      <FiberManualRecordIcon sx={{ fontSize: "10px" }} />
                    }
                  >
                    <Link
                      style={{
                        color: "#b6b6b6",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                      to={"/register"}
                    >
                      Đăng ký
                    </Link>
                    <Link
                      style={{
                        color: "#b6b6b6",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                      to={"/login"}
                    >
                      Đăng nhập
                    </Link>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Row>
          <Row className="">
            <Stack
              direction={"row"}
              className="mt-1 py-2"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Box sx={{ width: "20%" }}>
                <Link
                  style={{
                    color: "#b6b6b6",
                    textDecoration: "none",
                    fontWeight: "600",
                    paddingLeft: "10px",
                  }}
                  to={"/shop/login"}
                >
                  <FiberManualRecordIcon sx={{ fontSize: "10px" }} /> Seller
                  center
                </Link>
              </Box>
              <SearchBar></SearchBar>
              <Box sx={{ width: "20%" }}>
                {userdetail && !isError ? (
                  <Stack direction={"row"} gap={1} sx={{ justifyContent: "end" }}>
                    <Link
                      to={"/chat"}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      <Badge
                        badgeContent={ "0"
                        }
                        sx={{ display: "inline-block", marginRight: "10px" }}
                        color="error"
                      >
                        <ChatIcon sx={{ color: "white" }} />
                      </Badge>
                    </Link>
                    <Link
                      to={"/cart"}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      <Badge
                        badgeContent={
                          (totalItem != undefined ||
                            totalItem != null ||
                            totalItem == 0) &&
                          totalErr == false
                            ? totalItem == 0
                              ? "0"
                              : totalItem
                            : "0"
                        }
                        sx={{ display: "inline-block", marginRight: "10px" }}
                        color="error"
                      >
                        <ShoppingCartOutlinedIcon sx={{ color: "white" }} />
                      </Badge>
                      Giỏ hàng
                    </Link>

                    <Link
                      to={"/favourite"}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      <Badge
                        badgeContent={
                          (totalFavourites != undefined ||
                            totalFavourites != null) &&
                          !favouriteError
                            ? totalFavourites
                            : "0"
                        }
                        sx={{ display: "inline-block", marginRight: "10px" }}
                        color="error"
                      >
                        <FavoriteBorderIcon sx={{ color: "white" }} />
                      </Badge>
                      Yêu thích
                    </Link>
                  </Stack>
                ) : null}
              </Box>
            </Stack>
          </Row>
        </Container>
      </div>
    </header>
  );
};

export default ClientHeader;
