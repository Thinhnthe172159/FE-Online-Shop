// import React, { useState, useEffect } from "react";
// import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
// import { Stack } from "react-bootstrap";
// import FormGroup from "@mui/material/FormGroup";
// import { fetch } from "../../../api/Fetch";

// const ProductNav = ({ onCategoryChange }) => {
//   const [categories, setCategories] = useState([]); // Store category list
//   const [selectedCategories, setSelectedCategories] = useState([]); // Store selected categories
//   const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // Store selected price ranges
//   const [loading, setLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch.get("/category/get-all");
//         if (response && response.data && response.data.code === 200) {
//           const categoryList = response.data.data;
//           setCategories(categoryList); // Set category data
//           // Set all categories as selected by default
//           const allCategoryValues = categoryList.map((category) => category.value);
//           setSelectedCategories(allCategoryValues); // Select all categories
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData(); // Call API when component mounts
//   }, []);

//   // Handle category selection/deselection
//   const handleCategoryChange = (event) => {
//     const { value, checked } = event.target;
//     setSelectedCategories((prevSelected) => {
//       if (checked) {
//         return [...prevSelected, Number(value)];
//       } else {
//         return prevSelected.filter((category) => category !== value);
//       }
//     });
//   };

//   // Handle price range selection/deselection
//   const handlePriceRangeChange = (event) => {
//     const { value, checked } = event.target;
//     setSelectedPriceRanges((prevSelected) => {
//       if (checked) {
//         return [...prevSelected, value];
//       } else {
//         return prevSelected.filter((range) => range !== value);
//       }
//     });
//   };

//   // Handle "Select All" functionality for categories
//   const handleSelectAllCategories = () => {
//     if (selectedCategories.length === categories.length) {
//       setSelectedCategories([]); // Deselect all if all are selected
//     } else {
//       setSelectedCategories(categories.map((category) => category.value));
//     }
//   };

//   useEffect(() => {
//     onCategoryChange(selectedCategories);
//     onPriceRangeChange(selectedPriceRanges);
//   }, [selectedCategories, selectedPriceRanges, onCategoryChange, onPriceRangeChange]);

//   if (loading) {
//     return <Typography>Đang tải...</Typography>;
//   }

//   return (
//     <div id="product-nav">
//       <Typography className="mb-4" variant="h6" color="initial">
//         <b>Hàng hóa</b>
//       </Typography>
//       <Box
//         sx={{
//           border: "1px solid #ccc",
//           padding: "10px",
//           width: "100%",
//           boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
//         }}
//       >
//         <Stack>
//           <p className="mb-3">
//             <b>Nhóm hàng</b>
//           </p>
//           <div style={{ width: "100%" }}>
//             {/* Select All checkbox for categories */}
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={selectedCategories.length === categories.length}
//                   onChange={handleSelectAllCategories}
//                 />
//               }
//               label="Chọn tất cả nhóm hàng"
//             />
//             {/* Category checkboxes */}
//             <FormGroup sx={{ marginLeft: "20px", width: "100%" }}>
//               {categories.map((category) => (
//                 <FormControlLabel
//                   key={category.value}
//                   control={
//                     <Checkbox
//                       value={category.value}
//                       checked={selectedCategories.includes(category.value)}
//                       onChange={handleCategoryChange}
//                     />
//                   }
//                   label={category.label}
//                 />
//               ))}
//             </FormGroup>
//           </div>
//           <p className="mb-3">
//             <b>Khoảng giá</b>
//           </p>
//           <div style={{ width: "100%" }}>
//             {/* Price range checkboxes */}
//             <FormGroup sx={{ marginLeft: "20px", width: "100%" }}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     value="0-100000"
//                     checked={selectedPriceRanges.includes("0-100000")}
//                     onChange={handlePriceRangeChange}
//                   />
//                 }
//                 label="0 VND - 100,000 VND"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     value="100000-1000000"
//                     checked={selectedPriceRanges.includes("100000-1000000")}
//                     onChange={handlePriceRangeChange}
//                   />
//                 }
//                 label="100,000 VND - 1,000,000 VND"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     value="1000000-10000000"
//                     checked={selectedPriceRanges.includes("1000000-10000000")}
//                     onChange={handlePriceRangeChange}
//                   />
//                 }
//                 label="1,000,000 VND - 10,000,000 VND"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     value="10000000+"
//                     checked={selectedPriceRanges.includes("10000000+")}
//                     onChange={handlePriceRangeChange}
//                   />
//                 }
//                 label="10,000,000 VND +"
//               />
//             </FormGroup>
//           </div>
//         </Stack>
//       </Box>
//     </div>
//   );
// };

// export default ProductNav;

import React, { useState, useEffect } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Stack } from "react-bootstrap";
import FormGroup from "@mui/material/FormGroup";
import { fetch } from "../../../api/Fetch";

const ProductNav = ({ onCategoryChange, onPriceRangeChange }) => {
  const [categories, setCategories] = useState([]); // Store category list
  const [selectedCategories, setSelectedCategories] = useState([]); // Store selected categories
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // Store selected price ranges
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch.get("/category/get-all");
        if (response && response.data && response.data.code === 200) {
          const categoryList = response.data.data;
          setCategories(categoryList); // Set category data
          // Set all categories as selected by default
          const allCategoryValues = categoryList.map((category) => category.value);
          setSelectedCategories(allCategoryValues); // Select all categories
          handleSelectAllPriceRanges();
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData(); // Call API when component mounts
  }, []);

  // Handle category selection/deselection
  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prevSelected) => {
      if (checked) {
        return [...prevSelected, Number(value)];
      } else {
        return prevSelected.filter((category) => category !== Number(value));
      }
    });
  };

  // Handle price range selection/deselection
  const handlePriceRangeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPriceRanges((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((range) => range !== value);
      }
    });
  };

  // Handle "Select All" functionality for categories
  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]); // Deselect all if all are selected
    } else {
      setSelectedCategories(categories.map((category) => category.value));
    }
  };

  // Handle "Select All" functionality for price ranges
  const handleSelectAllPriceRanges = () => {
    if (selectedPriceRanges.length === 4) { // There are 4 price ranges
      setSelectedPriceRanges([]); // Deselect all if all are selected
    } else {
      setSelectedPriceRanges(["0-100000", "100000-1000000", "1000000-10000000", "10000000+"]);
    }
  };

  useEffect(() => {
    onCategoryChange(selectedCategories);
    onPriceRangeChange(selectedPriceRanges);
  }, [selectedCategories, selectedPriceRanges, onCategoryChange, onPriceRangeChange]);

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <div id="product-nav">
      <Typography className="mb-4" variant="h6" color="initial">
        <b>Hàng hóa</b>
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: "10px",
          width: "100%",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <Stack>
          <p className="mb-3">
            <b>Nhóm hàng</b>
          </p>
          <div style={{ width: "100%" }}>
            {/* Select All checkbox for categories */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCategories.length === categories.length}
                  onChange={handleSelectAllCategories}
                />
              }
              label="Chọn tất cả nhóm hàng"
            />
            {/* Category checkboxes */}
            <FormGroup sx={{ marginLeft: "20px", width: "100%" }}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.value}
                  control={
                    <Checkbox
                      value={category.value}
                      checked={selectedCategories.includes(category.value)}
                      onChange={handleCategoryChange}
                    />
                  }
                  label={category.label}
                />
              ))}
            </FormGroup>
          </div>
            <br/>
          <p className="mb-3">
            <b>Khoảng giá</b>
          </p>
          <div style={{ width: "100%" }}>
            {/* Select All checkbox for price ranges */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedPriceRanges.length === 4} // 4 price ranges
                  onChange={handleSelectAllPriceRanges}
                />
              }
              label="Chọn tất cả khoảng giá"
            />
            {/* Price range checkboxes */}
            <FormGroup sx={{ marginLeft: "20px", width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="0-100000"
                    checked={selectedPriceRanges.includes("0-100000")}
                    onChange={handlePriceRangeChange}
                  />
                }
                label="0 VND - 100,000 VND"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="100000-1000000"
                    checked={selectedPriceRanges.includes("100000-1000000")}
                    onChange={handlePriceRangeChange}
                  />
                }
                label="100,000 VND - 1,000,000 VND"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="1000000-10000000"
                    checked={selectedPriceRanges.includes("1000000-10000000")}
                    onChange={handlePriceRangeChange}
                  />
                }
                label="1,000,000 VND - 10,000,000 VND"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="10000000+"
                    checked={selectedPriceRanges.includes("10000000+")}
                    onChange={handlePriceRangeChange}
                  />
                }
                label="10,000,000 VND +"
              />
            </FormGroup>
          </div>
        </Stack>
      </Box>
    </div>
  );
};

export default ProductNav;

