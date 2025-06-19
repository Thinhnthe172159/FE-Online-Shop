import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "react-bootstrap";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Alert from "@mui/material/Alert";
import "./setup.scss";
import axios from "axios";
import Step5 from "./Step5";
import { useQuery } from "@tanstack/react-query";
import { getShop } from "../../../api/shopApi";
import { Navigate } from "react-router-dom";
import Loading from "../../client-module/loading/Loading";
import { useSelector } from "react-redux";
import { getAllShopOwner } from "../../../api/ShopOwnerApi";

const steps = [
  "Thông tin cửa hàng",
  "Cài đặt vận chuyển",
  "Thông tin thuế",
  "Thông tin định danh",
  "Hoàn tất",
];




export default function SetUpShop() {
  const {data} = useQuery({
    queryKey:['shopo'],
    queryFn: getAllShopOwner
  })
  console.log(data);
  const [shop, setShop] = React.useState({
    name: "",
    desc: "",
  });
  const [logo, setLogo] = React.useState(null);
  const [address, setAddress] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [phone, setPhone] = React.useState([]);
  const [taxNumber, setTaxNumber] = React.useState("");
  const [shippingOptions, setShippingOptions] = React.useState([]); // Trạng thái lưu checkbox
  const [businessLicenseImages, setBusinessLicenseImages] = React.useState([]);
  const [shipCost, setShipCost] = React.useState([
    {
      label: "Hàng nhẹ (khối lượng tính toán từ 0 - 2 kg)",
      startWeight: 0,
      endWeight: 2,
      cost: "",
      finalCost: 0,
    },
    {
      label: "Hàng trung bình (khối lượng tính toán từ 2 - 5 kg)",
      startWeight: 2,
      endWeight: 5,
      cost: "",
      finalCost: 0,
    },
    {
      label: "Hàng nặng (khối lượng tính toán trên 5kg)",
      startWeight: 5,
      endWeight: null,
      cost: "",
      finalCost: 0,
    },
  ]);

  const [identify, setIdentify] = React.useState({
    idNumber: "",
    idName: "",
    frontImage: null,
    backImage: null,
    province: "",
    district: "",
    ward: "",
  });
  const setupData = {
    shop,
    logo,
    address,
    phone,
    taxNumber,
    shippingOptions,
    businessLicenseImages,
    shipCost,
    identify,
  };
  const handleIdentifyChange = (key, value) => {
    setIdentify({ ...identify, [key]: value });
  };

  const [err, setErr] = React.useState(null);
  const handleBusinessLicenseUpload = (e) => {
    const files = Array.from(e.target.files);
    setBusinessLicenseImages([...businessLicenseImages, ...files]);
  };
  const handleShopValue = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const handleEditor = (content) => {
    setShop({ ...shop, desc: content });
  };

  const handleLogoUpload = (file) => {
    setLogo(file);
  };

  const addPhoneNumber = () => {
    setPhone([...phone, { phoneNumber: "" }]);
  };

  const handlePhoneValue = (i, e) => {
    const updatedPhone = phone.map((item, index) =>
      index === i ? { ...item, phoneNumber: e.target.value } : item
    );
    setPhone(updatedPhone);
  };

  const deletePhone = (i) => {
    setPhone(phone.filter((item, index) => index !== i));
  };

  const addAddress = (data) => {
    setAddress([...address, data]);
  };

  const deleteAddress = (i) => {
    setAddress(address.filter((_, index) => index !== i - 1));
  };

  const handleShippingOption = (value) => {
    if (shippingOptions.includes(value)) {
      setShippingOptions(shippingOptions.filter((item) => item !== value));
    } else {
      setShippingOptions([...shippingOptions, value]);
    }
  };

  const handleInputShipCost = (value, index) => {
    const updatedCost = [...shipCost];
    let rawValue = value.replace(/\./g, ""); // Loại bỏ dấu chấm để giữ dạng số nguyên

    if (/^\d+$/.test(rawValue)) {
      updatedCost[index].finalCost = parseInt(rawValue, 10); // Lưu giá trị không format
      updatedCost[index].cost = formatCurrency(rawValue); // Lưu giá trị có format để hiển thị
    } else {
      updatedCost[index].finalCost = 0; // Nếu nhập không hợp lệ, đặt về 0
      updatedCost[index].cost = ""; // Clear giá trị hiển thị
    }

    setShipCost(updatedCost);
  };

  // Hàm format để thêm dấu chấm vào `cost`
  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const validateStep1 = () => {
    if (!shop.name.trim()) {
      setErr("Tên cửa hàng là bắt buộc.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (!shop.desc.trim()) {
      setErr("Mô tả cửa hàng là bắt buộc.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (!logo) {
      setErr("Vui lòng thêm logo cửa hàng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (phone.length === 0) {
      setErr("Vui lòng thêm ít nhất một số điện thoại của cửa hàng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (!phone.every((item) => /^0[0-9]{9}$/.test(item.phoneNumber))) {
      setErr("Số điện thoại không đúng định dạng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (address.length === 0) {
      setErr("Vui lòng thêm ít nhất một địa chỉ của cửa hàng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    setErr(null); // Clear error if validation passes
    return true;
  };

  const validateStep2 = () => {
    if (shippingOptions.length === 0) {
      setErr("Vui lòng chọn ít nhất một tùy chọn vận chuyển.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (shippingOptions.includes(1)) {
      const emptyCost = shipCost.some((item) => item.finalCost === 0);
      if (emptyCost) {
        setErr(
          "Vui lòng nhập đầy đủ giá vận chuyển cho tất cả các khối lượng."
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }
    }
    setErr(null);
    return true;
  };

  const validateStep3 = () => {
    if (!taxNumber || !validateTaxNumber(taxNumber)) {
      setErr("Mã số thuế không hợp lệ. Mã số thuế phải có 10 hoặc 13 chữ số.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    setErr(null);
    return true;
  };
  const validateTaxNumber = (taxNumber) => /^[0-9]{10,13}$/.test(taxNumber);

  const validateStep4 = () => {
    const { idNumber, idName, frontImage, backImage } = identify;

    if (!idNumber || !idName || !frontImage || !backImage) {
      setErr(
        "Vui lòng điền đầy đủ thông tin định danh và tải lên cả hai mặt ảnh CCCD."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    let index = data.filter((item) => item.identification == idNumber)
    if(index != -1){
      setErr(
        "Căn cước công dân đã tồn tại"
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    
    

    const formFront = new FormData();
    formFront.append("image", frontImage);

    const formBack = new FormData();
    formBack.append("image", backImage);

    setLoading(true); // Bật trạng thái loading khi bắt đầu gọi API

    // Kiểm tra ảnh mặt trước
    return axios
      .post("https://api.fpt.ai/vision/idr/vnm/", formFront, {
        headers: { api_key: "D3G8zjy9LzLzeCq6c1Mex0Px3C7mY0co" },
      })
      .then((response) => {
        const dataFront = response.data.data[0];

        setIdentify({
          ...identify,
          province: dataFront.address_entities.province.toLowerCase(),
          district: dataFront.address_entities.district.toLowerCase(),
          ward: dataFront.address_entities.ward.toLowerCase(),
        });

        if (
          dataFront.id !== idNumber ||
          dataFront.name.toLowerCase() !== idName.toLowerCase()
        ) {
          setErr("Thông tin CCCD mặt trước không khớp. Vui lòng kiểm tra lại.");
          setLoading(false); // Tắt loading nếu có lỗi
          return false;
        }

        // Nếu mặt trước hợp lệ, kiểm tra ảnh mặt sau
        return axios
          .post("https://api.fpt.ai/vision/idr/vnm/", formBack, {
            headers: { api_key: "D3G8zjy9LzLzeCq6c1Mex0Px3C7mY0co" },
          })
          .then((response) => {
            console.log(response);
            setErr(null); // Nếu mặt sau hợp lệ, xóa lỗi
            setLoading(false); // Tắt trạng thái loading
            return true;
          })
          .catch((error) => {
            setErr("Lỗi xác thực ảnh CCCD mặt sau. Vui lòng kiểm tra lại.");
            setLoading(false); // Tắt loading nếu có lỗi
            return false;
          });
      })
      .catch((error) => {
        setErr("Lỗi xác thực ảnh CCCD mặt trước. Vui lòng kiểm tra lại.");
        setLoading(false); // Tắt loading nếu có lỗi
        return false;
      });
  };

  const stepComponents = [
    <Step1
      addPhoneNumber={addPhoneNumber}
      phone={phone}
      deletePhone={deletePhone}
      deleteAddress={deleteAddress}
      addAddress={addAddress}
      address={address}
      handleShopValue={handleShopValue}
      handleEditor={handleEditor}
      handlePhoneValue={handlePhoneValue}
      handleLogoUpload={handleLogoUpload}
      logo={logo}
      err={err}
    />,
    <Step2
      shippingOptions={shippingOptions}
      shipCost={shipCost}
      handleShippingOption={handleShippingOption}
      handleInputShipCost={handleInputShipCost}
      err={err}
    />,
    <Step3
      taxNumber={taxNumber}
      handleTaxNumberChange={(e) => setTaxNumber(e.target.value)}
      businessLicenseImages={businessLicenseImages}
      handleBusinessLicenseUpload={handleBusinessLicenseUpload}
      err={err}
    />,
    <Step4
      err={err}
      identify={identify}
      handleIdentifyChange={handleIdentifyChange}
      loading={loading}
    />,
    <Step5 setupData={setupData} />,
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = async () => {
    if (activeStep === 0 && !validateStep1()) return;
    if (activeStep === 1 && !validateStep2()) return;
    if (activeStep === 2 && !validateStep3()) return;
    if (activeStep === 3 && !(await validateStep4())) return;

    setErr(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const login = useSelector((state) => state.auth.login);

  const { data: shopData, isLoading } = useQuery({
    queryKey: ["getShop"],
    queryFn: getShop,
    retry: 1,
  });

  if (!login) {
    return <Navigate to="/" />;
  }
  if (isLoading) {
    return <Loading></Loading>;
  } else {
    if (shopData) {
      return <Navigate to="/seller" />;
    } else {
      return (
        <div
          id="setup-shop"
          style={{
            backgroundColor: "#f6f6f6",
            paddingTop: "100px",
            paddingBottom: "100px",
            minHeight: "100vh",
          }}
        >
          <Container style={{ width: "80%" }}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "white",
                padding: "50px",
                borderRadius: "10px",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
            >
              <div className="setup-content">
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                {/* Alert hiển thị lỗi */}
              </div>

              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    Tất cả các bước đã hoàn thành - bạn đã xong
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Đặt lại</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {stepComponents[activeStep]}
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0 || loading} // Ẩn khi loading
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Quay lại
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep === steps.length - 1 ? (
                      ""
                    ) : (
                      <Button onClick={handleNext} disabled={loading}>
                        Tiếp theo
                      </Button>
                    )}
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </Container>
        </div>
      );
    }
  }
}
