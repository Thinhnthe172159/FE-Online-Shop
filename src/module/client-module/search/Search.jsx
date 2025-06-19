import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductSearch from './ProductSearch';
import ShopSearch from './ShopSearch';
import { useSearchParams } from 'react-router-dom';

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
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
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

export default function Search() {
  const [value, setValue] = React.useState(0);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const key = searchParams.get("key") || "";

  React.useEffect(() => {
    if (type === "shop") {
      setValue(0); // Switch to ShopSearch
    } else {
      setValue(1); // Default to ProductSearch
    }
  }, [type]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", justifyContent: "center" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{ textTransform: "initial" }} label="Tìm kiếm theo cửa hàng" {...a11yProps(0)} />
          <Tab sx={{ textTransform: "initial" }} label="Tìm kiếm theo sản phẩm" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ShopSearch />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProductSearch searchTerm={key} />
      </CustomTabPanel>
    </Box>
  );
}