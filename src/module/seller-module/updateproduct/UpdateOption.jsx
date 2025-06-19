import React, { useEffect, useState } from "react";
import { Stack, Box, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetch } from '../../../api/Fetch';
import Swal from "sweetalert2";

const UpdateOption = () => {
  const { id } = useParams(); // Product ID
  const [options, setOptions] = useState([{ id: 0, name: "", quantity: "0" }]);
  const [addons, setAddons] = useState([{ id: 0, name: "", price: "" }]);
  const [error, setError] = useState(false);

  // Fetch product details and populate options and addons
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch.get(`/product/getbyID/${id}`);
        const productData = response.data;

        if (productData) {
          setOptions(productData.options || [{ id: 0, name: "", quantity: "0" }]);

          // Format price cho addons ngay khi nhận dữ liệu
          const formattedAddons = productData.addOns.map(addon => ({
            ...addon,
            price: formatCurrency(addon.price.toString()), // Định dạng price khi lấy về
          }));
          setAddons(formattedAddons);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { id: 0, name: "", quantity: "0" }]);
    }
  };

  const handleRemoveOption = async (index) => {
    const optionId = options[index].id;
  
    if (optionId !== 0) { // Only call API for existing options
      const confirmed = window.confirm("Are you sure you want to delete this option?");
      if (confirmed) {
        try {
          const response = await fetch.delete(`/product/deleteOption?id=${optionId}`);
          console.log(`Option with ID ${optionId} deleted successfully.`);
          
          // Update the state to remove the option locally
          setOptions(options.filter((_, i) => i !== index));
        } catch (error) {
          console.error('Error deleting option:', error);
        }
      }
    } else {
      // If it's a new option (id = 0), just remove it locally
      setOptions(options.filter((_, i) => i !== index));
    }
  };
  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, ""); // Loại bỏ các ký tự không phải số
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu chấm vào hàng nghìn
  };

  // Hàm xử lý khi thay đổi giá của add-on
  const handleAddonPriceChange = (index, value) => {
    const formattedPrice = formatCurrency(value); // Định dạng giá
    const newAddons = [...addons];
    newAddons[index].price = formattedPrice; // Cập nhật giá đã định dạng
    setAddons(newAddons);
  };

  const handleAddAddon = () => {
    if (addons.length < 5) {
      setAddons([...addons, { id: 0, name: "", price: "" }]);
    }
  };

  const handleRemoveAddon = async (index) => {
    const addonId = addons[index].id;
    if (addonId !== 0) { // Only call API for existing addons
      const confirmed = window.confirm("Are you sure you want to delete this add-on?");
    if (confirmed) {
        try {
          await fetch.delete(`/product/deleteAddOn?addOnId=${addonId}`);
          console.log(`Add-on with ID ${addonId} deleted successfully.`);
          // Update the state to remove the addon locally
          setAddons(addons.filter((_, i) => i !== index));
        } catch (error) {
          console.error('Error deleting addon:', error);
        }
    }
    } else {
      // If it's a new addon (id = 0), just remove it locally
      setAddons(addons.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    const allFieldsFilled =
      options.every((opt) => opt.name.trim() && opt.quantity) &&
      addons.every((addon) => addon.name && addon.price);
  
    // Check for duplicate names in options and addons
    const optionNames = options.map(opt => opt.name.trim().toLowerCase());
    const addonNames = addons.map(addon => addon.name.trim().toLowerCase());
  
    const hasDuplicateOptions = optionNames.some((name, index) => optionNames.indexOf(name) !== index);
    const hasDuplicateAddons = addonNames.some((name, index) => addonNames.indexOf(name) !== index);
  
    if (hasDuplicateOptions || hasDuplicateAddons) {
      setError(true);
      return;
    }
  
    if (allFieldsFilled) {
      setError(false);
  
      // Separate new options and addons
      const newOptions = options.filter((opt) => opt.id === 0); // Options to create
      const existingOptions = options.filter((opt) => opt.id !== 0); // Options to update
  
      const newAddons = addons.filter((addon) => addon.id === 0); // Add-ons to create
      const existingAddons = addons.filter((addon) => addon.id !== 0); // Add-ons to update
  
      try {
        if (newOptions.length > 0) {
          // Call create API for new options
          for (let option of newOptions) {
            const createResponse = await fetch.post(`/product/addOption`, {
              name: option.name,
              quantity: option.quantity,
              productId: id, // Product ID from the URL
            });
            console.log("Option created:", createResponse.data);
          }
        }
  
        if (newAddons.length > 0) {
          for (let addon of newAddons) {
            const updateResponse = await fetch.post(`/product/addAddOn`, {
              name: addon.name,
              price: addon.price,
              productId: id,
            });
            console.log("Add-on created:", updateResponse.data);
          }
        }
  
        if (existingAddons.length > 0) {
          for (let addon of existingAddons) {
            // Check if the name or price has changed
            const originalAddon = addons.find(a => a.id === addon.id); // Find the original addon data
            
            const isNameChanged = addon.name !== originalAddon.name;
            const isPriceChanged = addon.price !== originalAddon.price;
  
            // If either the name or price has changed, send the update
            if (true) {
              const updateResponse = await fetch.put(`/product/updateAddOn`, {
                id: addon.id,
                name: addon.name,
                price: addon.price * 1000,
              });
              console.log("Add-on updated:", updateResponse.data);
            } else {
              console.log(`No changes for add-on ${addon.id}, skipping update.`);
            }
          }
        }
  
        if (existingOptions.length > 0) {
          for (let option of existingOptions) {
            // Check if the name or quantity has changed
            const originalOption = options.find(o => o.id === option.id); // Find the original option data
            
            const isNameChanged = option.name !== originalOption.name;
            const isQuantityChanged = option.quantity !== originalOption.quantity;
  
            // If either the name or quantity has changed, send the update
            if (true) {
              const updateResponse = await fetch.put(`/product/updateOption`, {
                id: option.id,
                name: option.name,
                quantity: option.quantity,
              });
              console.log("Option updated:", updateResponse.data);
              Swal.fire({
                icon:"success",
                text:"Cập nhật thành công"
              })
            } else {
              console.log(`No changes for option ${option.id}, skipping update.`);
            }
          }
        }
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    } else {
      setError(true);
    }
  };
  

  return (
    <Container style={{ width: "70%" }}>
      <div>
        <div className="body-option">
          <div className="form-header">
            <h3>Cập nhật thông tin tùy chọn</h3>
          </div>
          <Box className="mt-5 mb-3" sx={{ justifyContent: "space-between", display: "flex" }}>
            <h6>
              <i>
                Thêm tùy chọn <span style={{ color: "red" }}>*</span>
              </i>{" "}
              :
            </h6>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="outlined"
              onClick={handleAddOption}
            >
              + Thêm mới tùy chọn
            </Button>
          </Box>

          {options.map((option, index) => (
            <Stack direction={"row"} spacing={3} key={option.id}>
              <Stack direction={"row"} sx={{ width: "50%", alignItems: "center",marginTop:"2rem" }} spacing={2}>
                <label>
                  Tên tùy chọn <span style={{ color: "red" }}>*</span> :
                </label>
                <TextField
                  variant="standard"
                  sx={{ width: "70%" }}
                  label="Tên lựa chọn"
                  value={option.name}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index].name = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              </Stack>

              <Stack direction={"row"} sx={{ width: "50%", alignItems: "center" }} spacing={2}>
                <label>
                  Số lượng <span style={{ color: "red" }}>*</span> :
                </label>
                <TextField
                  type="number"
                  variant="standard"
                  sx={{ width: "70%" }}
                  label="Số lượng"
                  value={option.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 1) {
                      const newOptions = [...options];
                      newOptions[index].quantity = value;
                      setOptions(newOptions);
                    }
                  }}
                />
              </Stack>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length === 1}
              >
                <DeleteIcon />
              </Button>
            </Stack>
          ))}
        </div>

        <div className="body-addon">
          <Box className="mt-5 mb-3" sx={{ justifyContent: "space-between", display: "flex" }}>
            <h6>
              <i>Các tính năng bổ sung</i> :
            </h6>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="outlined"
              onClick={handleAddAddon}
            >
              + Thêm mới các tính năng bổ sung
            </Button>
          </Box>

          {addons.map((addon, index) => (
            <Stack direction={"row"} spacing={3} key={addon.id}>
              <Stack direction={"row"} sx={{ width: "50%", alignItems: "center" }} spacing={2}>
                <label>Tên chức năng :</label>
                <TextField
                  variant="standard"
                  sx={{ width: "70%" }}
                  label="Tên lựa chọn"
                  value={addon.name}
                  onChange={(e) => {
                    const newAddons = [...addons];
                    newAddons[index].name = e.target.value;
                    setAddons(newAddons);
                  }}
                />
              </Stack>

              <Stack direction={"row"} sx={{ width: "50%", alignItems: "center" }} spacing={2}>
                <label>Giá tiền :</label>
                <TextField
                  variant="standard"
                  sx={{ width: "70%" }}
                  label="Giá tiền"
                  value={addon.price}
                  onChange={(e) => handleAddonPriceChange(index, e.target.value)} // Sử dụng hàm xử lý định dạng giá tiền
                />
              </Stack>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveAddon(index)}
              >
                <DeleteIcon />
              </Button>
            </Stack>
          ))}
        </div>

        {error && (
          <Box mt={3} color="red">
            Tất cả các trường phải được điền và không được trùng tên (All fields must be filled and names must be unique).
          </Box>
        )}

        <Stack className="mt-5" sx={{ justifyContent: "end" }} direction={"row"}>
          <Button variant="contained" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Stack>
      </div>
    </Container>
  );
};

export default UpdateOption;
