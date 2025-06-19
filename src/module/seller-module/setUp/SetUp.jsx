import React, { useEffect, useRef, useState } from "react";
import "./setup.scss";
import { Container, Form } from "react-bootstrap";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { South } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetch } from "../../../api/Fetch";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import { getShop } from "../../../api/shopApi";
import Loading from "../../client-module/loading/Loading";

const SetUp = () => {
  const [province, setProvince] = useState([]);
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((data) => setProvince(data.data.data));
  }, []);
  const navigate = useNavigate();
  const [showAutoCost, setShowAutoCost] = useState(false);
  const [err, setErr] = useState(null);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState([]);
  const [desc, setDesc] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [phone, setPhone] = useState([
    {
      value: "",
      err: false,
      errMess: null,
    },
  ]);

  const [address, setAdrress] = useState([
    {
      detail: null,
      province: null,
      district: null,
      ward: null,
      listDistrict: [],
      listWard: [],
    },
  ]);

  const logoRef = useRef();

  const [manageShip, setManageShip] = useState([
    {
      name: "Hàng nhẹ (khối lượng tính toán từ 0 - 5 kg)",
      cost: "",
      finalCost: "",
    },
    {
      name: "Hàng trung bình (khối lượng tính toán từ 6 - 15 kg)",
      cost: "",
      finalCost: "",
    },
    {
      name: "Hàng nặng  (khối lượng tính toán từ 16 - 30 kg)",
      cost: "",
      finalCost: "",
    },
    {
      name: "Hàng cồng kềnh (khối lượng tính toán trên 30)",
      cost: "",
      finalCost: "",
    },
  ]);

  //xử lý số điện thoại

  const handleAddPhone = () => {
    setPhone([
      ...phone,
      {
        value: "",
        err: false,
        errMess: null,
      },
    ]);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleDeletePhone = (index) => {
    setPhone(phone.filter((item, i) => i != index));
  };

  const handleInputPhone = (value, index) => {
    const updatePhone = [...phone];

    // Cập nhật giá trị mới cho số điện thoại ngay khi người dùng nhập
    updatePhone[index].value = value;

    // Kiểm tra nếu số điện thoại có đủ 10 chữ số thì mới kiểm tra regex
    if (value.length === 10 && value.length < 11) {
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

      if (!phoneRegex.test(value)) {
        updatePhone[index].err = true;
        updatePhone[index].errMess = "Số điện thoại không hợp lệ";
      } else {
        updatePhone[index].err = false;
        updatePhone[index].errMess = null;
      }
    } else {
      // Nếu chưa đủ 10 chữ số, có lỗi
      updatePhone[index].err = true;
      updatePhone[index].errMess = "Số điện thoại không hợp lệ";
    }
    setPhone(updatePhone);
  };

  // xử lý address
  const handleAddAddress = () => {
    setAdrress([
      ...address,
      {
        detail: null,
        province: null,
        district: null,
        ward: null,
        listDistrict: [],
        listWard: [],
      },
    ]);
  };

  const deleteAddress = (index) => {
    setAdrress(address.filter((e, i) => i != index));
  };

  const handleInputAddress = (value, index) => {
    const updateAddress = [...address];
    updateAddress[index].detail = value;
    setAdrress(updateAddress);
  };

  const handleSelectProvince = (item, index) => {
    // Kiểm tra nếu người dùng chọn "None" (item === "")
    if (item === "") {
      const updatedAddress = [...address];
      updatedAddress[index] = {
        ...updatedAddress[index], // Giữ lại các thuộc tính khác
        province: null, // Đặt giá trị tỉnh/thành về null
        district: null, // Reset giá trị quận/huyện
        ward: null, // Reset giá trị phường/xã
        listDistrict: [], // Làm trống danh sách quận/huyện
        listWard: [], // Làm trống danh sách phường/xã
      };
      setAdrress(updatedAddress); // Cập nhật lại state
    } else {
      // Nếu item khác rỗng, xử lý bình thường
      const selectedProvince = JSON.parse(item);
      const updatedAddress = [...address];

      // Gọi API để lấy danh sách quận/huyện
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince.id}.htm`)
        .then((data) => {
          updatedAddress[index] = {
            ...updatedAddress[index],
            province: selectedProvince,
            listDistrict: data.data.data, // Cập nhật danh sách quận/huyện
            district: null, // Reset quận/huyện đã chọn
            ward: null, // Reset phường/xã đã chọn
            listWard: [], // Làm trống danh sách phường/xã
          };
          setAdrress(updatedAddress); // Cập nhật lại state
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSelectDistrict = (item, index) => {
    // Kiểm tra nếu người dùng chọn "None" (item === "")
    if (item === "") {
      const updatedAddress = [...address];
      updatedAddress[index] = {
        ...updatedAddress[index], // Giữ lại các thuộc tính khác
        district: null, // Đặt giá trị quận/huyện về null
        ward: null, // Reset giá trị phường/xã
        listWard: [], // Làm trống danh sách phường/xã
      };
      setAdrress(updatedAddress); // Cập nhật lại state
    } else {
      // Nếu item khác rỗng, xử lý bình thường
      const selectedDistrict = JSON.parse(item);
      const updatedAddress = [...address];

      // Gọi API để lấy danh sách phường/xã
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict.id}.htm`)
        .then((data) => {
          updatedAddress[index] = {
            ...updatedAddress[index],
            district: selectedDistrict, // Cập nhật quận/huyện
            listWard: data.data.data, // Cập nhật danh sách phường/xã
            ward: null, // Reset phường/xã đã chọn
          };
          setAdrress(updatedAddress); // Cập nhật lại state
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleSelectWard = (item, index) => {
    // Kiểm tra nếu người dùng chọn "None" (item === "")
    if (item === "") {
      const updatedAddress = [...address];
      updatedAddress[index] = {
        ...updatedAddress[index], // Giữ lại các thuộc tính khác
        ward: null, // Đặt giá trị phường/xã về null
      };
      setAdrress(updatedAddress); // Cập nhật lại state
    } else {
      // Nếu item khác rỗng, xử lý bình thường
      const selectedWard = JSON.parse(item);
      const updatedAddress = [...address];

      updatedAddress[index] = {
        ...updatedAddress[index],
        ward: selectedWard, // Cập nhật phường/xã
      };

      setAdrress(updatedAddress); // Cập nhật lại state
    }
  };

  //xử lý editor
  const handleEditor = (content) => {
    setDesc(content);
  };
  //xu lý logo
  const handleUploadLogo = () => {
    logoRef.current.click(); // Mở input file khi click vào nút upload
  };
  //preview logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    

    if (file) {
      setLogo(file); // Lưu ảnh đã chọn vào state logo
      setPreviewLogo(URL.createObjectURL(file)); // Tạo URL để xem trước ảnh
    }
  };
  const handleDeleteLogo = (e) => {
    setLogo(null);
    setPreviewLogo(null);
    logoRef.current.value = "";
  };

  //xử ly ship
  const handleInputShip = (value, index) => {
    const updateShip = [...manageShip];

    // Loại bỏ tất cả dấu chấm hiện tại
    let rawValue = value.replace(/\./g, "");

    // Kiểm tra xem giá trị có phải là số không
    if (isNumeric(rawValue)) {
      // Chỉ định dạng lại nếu không có dấu chấm cuối cùng
      updateShip[index].cost = formatCurrency(rawValue); // Định dạng số tiền
      updateShip[index].finalCost = rawValue; // Lưu giá trị thô không định dạng
    } else {
      updateShip[index].cost = ""; // Xóa giá trị nếu không hợp lệ
      updateShip[index].finalCost = "";
    }
    setManageShip(updateShip);
  };

  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu chấm phân cách hàng ngàn
  };

  const isNumeric = (value) => {
    const regex = /^\d+$/; // Kiểm tra chỉ cho phép các ký tự số
    return regex.test(value);
  };

  //xử lý checkbox

  const handleCheckBox = (e) => {
    const value = parseInt(e.target.value); // Lấy giá trị của checkbox (dạng số)
    if (value === 1) {
      // Cập nhật trạng thái của checkbox "Hệ thống tự báo giá"
      setShowAutoCost(e.target.checked);
    }
    if (e.target.checked) {
      // Nếu checkbox được chọn, thêm giá trị vào mảng quote
      setQuote([...quote, value]);
    } else {
      // Nếu checkbox không được chọn, xóa giá trị khỏi mảng quote
      setQuote(quote.filter((item) => item !== value));
    }
  };

  //xử lý sau khi handleForm

  const saveShopSetting = (e) => {
    e.preventDefault();

    let check = validate();

    if (!check) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Di chuyển lên đầu trang khi có lỗi
      return;
    }

    // Xử lý phần phone
    const formattedPhone = phone.map((item) => ({
      phoneNumber: item.value,
    }));

    // Xử lý phần address
    const formattedAddress = address.map((item) => ({
      province: item.province ? item.province.name : null,
      district: item.district ? item.district.name : null,
      ward: item.ward ? item.ward.name : null,
      addressDetail: item.detail,
    }));

    // Xử lý phần autoShipCost
    let formattedAutoShipCost = quote.length === 1 ? quote[0] : 3;

    // Xử lý phần manageShip
    const formattedManageShip = !showAutoCost
      ? []
      : manageShip.map((item, index) => ({
          startWeight:
            index === 0 ? 0 : index === 1 ? 6 : index === 2 ? 16 : 31, // Giả sử các trọng lượng
          endWeight:
            index === 0 ? 5 : index === 1 ? 15 : index === 2 ? 30 : null, // Giả sử các trọng lượng
          cost: item.finalCost, // Giá cuối cùng
        }));

    // Tạo dữ liệu cuối cùng
    let data = {
      name: name,
      shopPhones: formattedPhone,
      shopAddresses: formattedAddress,
      description: desc,
      autoShipCost: formattedAutoShipCost,
      shipCosts: formattedManageShip,
    };
    let form = new FormData();
    form.append("data", JSON.stringify(data));
    form.append("logo", logo);
    fetch
      .post("/shop/add", form)
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Thêm địa chỉ thành công",
          confirmButtonText: "Trở lại",
          confirmButtonColor: "#28a745",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/seller");
          }
        });
      })
      .catch((er) => {
        Swal.fire({
          icon: "error",
          title: "Vui lòng thử lại sau",
          confirmButtonText: "Đi đến trang chủ",
          confirmButtonColor: "#28a745",
        });
      });
  };

  const { mutate } = useMutation({});

  // Validation function including logo validation
const validate = () => {
  // Kiểm tra tên cửa hàng
  if (name === "") {
    setErr("Vui lòng nhập tên cửa hàng");
    return false;
  }

  // Kiểm tra mô tả cửa hàng
  if (desc === "") {
    setErr("Vui lòng nhập mô tả cửa hàng");
    return false;
  }

  // Kiểm tra logo trong validate function
  if (logo == null) {
    setErr("Vui lòng thêm ảnh logo");
    return false;
  }

  // Validate logo file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validImageTypes.includes(logo.type)) {
    setErr("Logo phải là file ảnh (.jpeg, .jpg, .png)");
    return false;
  }

  // Kiểm tra số điện thoại
  for (const item of phone) {
    if (item.value === "") {
      setErr("Vui lòng nhập số điện thoại");
      return false;
    } else if (item.err) {
      setErr("Số điện thoại không hợp lệ");
      return false;
    }
  }

  // Kiểm tra địa chỉ
  for (const item of address) {
    if (!item.detail || item.detail.trim() === "") {
      setErr("Vui lòng nhập địa chỉ chi tiết");
      return false;
    }
    if (!item.province) {
      setErr("Vui lòng chọn tỉnh thành trong địa chỉ của bạn");
      return false;
    }
    if (!item.district) {
      setErr("Vui lòng chọn quận/huyện trong địa chỉ của bạn");
      return false;
    }
    if (!item.ward) {
      setErr("Vui lòng chọn xã/phường trong địa chỉ của bạn");
      return false;
    }
  }

  // Kiểm tra báo giá vận chuyển
  if (quote.length === 0) {
    setErr("Vui lòng chọn cách báo giá vận chuyển");
    return false;
  }

  // Kiểm tra giá vận chuyển cho từng loại khối lượng
  if (showAutoCost) {
    for (const item of manageShip) {
      if (!item.cost || item.cost === "") {
        setErr(`Vui lòng nhập giá tiền cho ${item.name}`);
        return false;
      }
    }
  }

  // Nếu tất cả đều hợp lệ, reset lỗi và trả về true
  setErr(null);
  return true;
};


  const { data, isLoading } = useQuery({
    queryKey: ["getShop"],
    queryFn: getShop,
    retry: 1,
  });

  if (isLoading) {
    return <Loading></Loading>;
  } else {
    if (data) {
      return <Navigate to="/seller"/>;
    } else {
      return (
        <div id="shop-setup" style={{ minHeight: "1000px" }} className="mt-4">
          <Container style={{ width: "80%" }}>
            <div className="shop-setup-head">
              <img
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                src="https://lh3.googleusercontent.com/MYTcna3WwQeij_32S9leAhsOZTgARR6GyWVGSC6Lvc3tKUxvXMfbAR4g-QX09yqsU5kYDOO7suyPOiveZfM6EkaFHG9-VjzWHwxFC3qghLoBzb25qtURN-Rw9ZUVFlC3wQ=w1839"
                alt=""
              />
            </div>

            <div className="shop-setup-body mt-3">
              <h5>Chúc mừng bạn đã đăng ký bán hàng thành công trên 6MEMs</h5>
              <ul>
                <li>
                  Xin chào! Chúng mình là 6MEMs - để có thể bán hàng ,vui lòng
                  cho chúng tôi biết thêm về cửa hàng của bạn
                </li>
                <li>
                  <b> Đăng ký Gian hàng</b> 6MEMs hoàn toàn miễn phí. Để hoàn tất
                  việc đăng ký bạn cần cho mọi người biết thêm về shop của bạn,
                  cài đặt mức phí vận chuyển
                </li>
              </ul>
            </div>

            <div className="shop-setup-form mt-5">
              <Container style={{ width: "70%" }}>
                <Form onSubmit={saveShopSetting}>
                  <h3 className="my-5 text-center">Thiết lập cửa hàng</h3>
                  {err != null ? (
                    <Alert className="mb-3" severity="error">
                      {err}
                    </Alert>
                  ) : (
                    ""
                  )}
                  <Stack className="mb-5">
                    <label htmlFor="" className="mb-3">
                      <b>Tên cửa hàng</b>{" "}
                      <span style={{ color: "red" }}>*</span> :
                    </label>
                    <TextField
                      value={name}
                      onChange={handleName}
                      sx={{ width: "100%", marginLeft: "20px" }}
                      variant="standard"
                      label="Câu trả lời của bạn"
                    />
                  </Stack>

                  <Stack className="mb-5">
                    <label htmlFor="" className="mb-3">
                      <b>Logo cửa hàng</b>{" "}
                      <span style={{ color: "red" }}>*</span> :
                    </label>
                    <input
                      onChange={handleLogoChange}
                      ref={logoRef}
                      style={{ display: "none" }}
                      type="file"
                    />
                    {previewLogo == null ? (
                      <Button onClick={handleUploadLogo}>Upload ảnh</Button>
                    ) : (
                      ""
                    )}
                    {/* Hiển thị ảnh xem trước nếu có */}
                    {previewLogo && (
                      <Stack spacing={2}>
                        <img
                          src={previewLogo}
                          alt="Logo Preview"
                          style={{
                            marginTop: "20px",
                            maxWidth: "200px",
                            height: "auto",
                          }}
                        />
                        <Button
                          onClick={handleDeleteLogo}
                          sx={{ width: "200px" }}
                          color="error"
                          variant="outlined"
                        >
                          Xóa ảnh
                        </Button>
                      </Stack>
                    )}
                  </Stack>

                  <Stack className="mb-5">
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <label htmlFor="" className="mb-3">
                        <b>Số điện thoại</b>{" "}
                        <span style={{ color: "red" }}>*</span> :
                      </label>
                      <Button onClick={handleAddPhone} variant="outlined">
                        + Thêm số điện thoại
                      </Button>
                    </Stack>
                    {phone.map((item, index) => {
                      return (
                        <Stack
                          direction={"row"}
                          sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <TextField
                            onChange={(e) =>
                              handleInputPhone(e.target.value, index)
                            }
                            value={item.value} // Gán giá trị từ state phone vào đây
                            className="mb-3"
                            sx={{ width: "70%", marginLeft: "20px" }}
                            variant="standard"
                            error={item.err} // Hiển thị lỗi nếu có
                            helperText={item.err && item.errMess} // Hiển thị thông báo lỗi nếu có
                            label="Câu trả lời của bạn"
                          />
                          {index > 0 ? (
                            <Button
                              onClick={() => handleDeletePhone(index)}
                              color="error"
                              variant="outlined"
                            >
                              + Xóa số điện thoại
                            </Button>
                          ) : (
                            ""
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>

                  <Stack className="mb-5">
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <label htmlFor="" className="mb-3">
                        <b>Địa chỉ của của hàng</b>{" "}
                        <span style={{ color: "red" }}>*</span> :
                      </label>
                      <Button variant="outlined" onClick={handleAddAddress}>
                        + Thêm địa chỉ
                      </Button>
                    </Stack>

                    {address.map((item, index) => {
                      return (
                        <Stack className="my-5 mx-4 ">
                          <Stack
                            direction={"row"}
                            sx={{
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="mb-2">
                              <b>
                                <i>Địa chỉ cơ sở {index + 1}</i>{" "}
                              </b>{" "}
                              :
                            </span>
                            <Stack
                              direction={"row"}
                              sx={{
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                              spacing={3}
                            >
                             
                              {index > 0 ? (
                                <Button
                                  onClick={() => deleteAddress(index)}
                                  color="error"
                                  variant="outlined"
                                >
                                  Xóa địa chỉ
                                </Button>
                              ) : (
                                ""
                              )}
                            </Stack>
                          </Stack>
                          <Stack
                            direction={"row"}
                            sx={{
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <TextField
                              className="mb-3"
                              onChange={(e) =>
                                handleInputAddress(e.target.value, index)
                              }
                              value={item.detail}
                              sx={{ width: "70%", marginLeft: "20px" }}
                              variant="standard"
                              label="Địa chỉ chi tiết"
                            />
                          </Stack>
                          <Stack
                            sx={{ marginLeft: "20px" }}
                            direction={"row"}
                            spacing={4}
                          >
                            <FormControl
                              variant="standard"
                              sx={{ m: 1, width: "30%" }}
                            >
                              <InputLabel>Chọn tỉnh thành</InputLabel>
                              <Select
                                onChange={(e) =>
                                  handleSelectProvince(e.target.value, index)
                                }
                                label="Chọn tỉnh thành"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {province.map((pro, proIndex) => {
                                  return (
                                    <MenuItem value={JSON.stringify(pro)}>
                                      {pro.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="standard"
                              sx={{ m: 1, width: "30%" }}
                            >
                              <InputLabel>Chọn Quận/Huyện</InputLabel>
                              <Select
                                onChange={(e) =>
                                  handleSelectDistrict(e.target.value, index)
                                }
                                label="Chọn Quận/Huyện"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {item.listDistrict.map((dis, disIndex) => {
                                  return (
                                    <MenuItem value={JSON.stringify(dis)}>
                                      {dis.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="standard"
                              sx={{ m: 1, width: "30%" }}
                            >
                              <InputLabel>Chọn Xã/Phường</InputLabel>
                              <Select
                                onChange={(e) =>
                                  handleSelectWard(e.target.value, index)
                                }
                                label="Chọn Xã/Phường"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {item.listWard.map((ward, wardindex) => {
                                  return (
                                    <MenuItem value={JSON.stringify(ward)}>
                                      {ward.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>

                  <Stack className="mb-5 mt-5">
                    <label htmlFor="" className="mb-3">
                      <b> Mô tả của hàng</b>{" "}
                      <span style={{ color: "red" }}>*</span> :
                    </label>
                    <Editor
                      onEditorChange={(content) => handleEditor(content)}
                      id="description"
                      apiKey="nzyv83pf6j7byh0gpj2588pjvd3r415xwispf0zt20z4h5s5"
                      init={{
                        height: 700,
                        plugins:
                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                      }}
                    />
                  </Stack>

                  {/* Quản lý vận chuyển */}
                  <Stack className="mb-5 mt-5">
                    <Stack
                      sx={{ justifyContent: "space-between" }}
                      direction={"row"}
                    >
                      <label htmlFor="" className="mb-3">
                        <b> Quản lý vận chuyển</b>{" "}
                        <span style={{ color: "red" }}>*</span> :
                      </label>
                    </Stack>

                    <Stack>
                      <ul>
                        <li>
                          Khối lượng sẽ được tính tùy theo chiều rộng, chiều dài
                          và chiều cao và giá sẽ được gợi ý trong đơn hàng của
                          khách hàng
                        </li>
                        <li>
                          Bạn cũng có thể báo giá sau cho cho khách sau khi
                          khách đặt hàng
                        </li>
                      </ul>
                    </Stack>

                    <Stack sx={{ marginLeft: "50px" }}>
                      <p>
                        <i>
                          * Lựa chọn báo giá cho đơn hàng(có thể chọn cả hai){" "}
                          <span style={{ color: "red" }}>*</span> :{" "}
                        </i>
                      </p>
                      <FormGroup onChange={handleCheckBox}>
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Báo giá cho khách hàng sau khi đặt hàng"
                          value={0}
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Hệ thống tự báo giá trong hóa đơn dựa vào số tiền bạn gợi ý"
                          value={1}
                        />
                      </FormGroup>
                    </Stack>

                    {showAutoCost ? (
                      <Stack sx={{ marginLeft: "50px", marginTop: "20px" }}>
                        <p>
                          <i>
                            * Thiết lập giá cho từng khối lượng tính toán{" "}
                            <span style={{ color: "red" }}>*</span> :{" "}
                          </i>
                        </p>

                        {manageShip.map((item, index) => {
                          return (
                            <Stack
                              direction={"row"}
                              sx={{
                                alignItems: "end",
                                justifyContent: "space-between",
                                marginLeft: "50px",
                              }}
                            >
                              <label htmlFor="">{item.name} :</label>
                              <TextField
                                onChange={(e) =>
                                  handleInputShip(e.target.value, index)
                                }
                                value={item.cost}
                                sx={{ width: "40%" }}
                                variant="standard"
                                id=""
                                label="Giá tiền"
                              />
                            </Stack>
                          );
                        })}
                      </Stack>
                    ) : (
                      ""
                    )}
                  </Stack>

                  <Stack className="mb-5">
                    <Button
                      type="submit"
                      sx={{
                        background: " #ffcf20",
                        color: "#1b1b1b",
                        textTransform: "capitalize",
                        borderRadius: "100px",
                      }}
                      variant="contained"
                    >
                      Lưu thiết lập
                    </Button>
                  </Stack>
                </Form>
              </Container>
            </div>
          </Container>
        </div>
      );
    }
  }
};

export default SetUp;
