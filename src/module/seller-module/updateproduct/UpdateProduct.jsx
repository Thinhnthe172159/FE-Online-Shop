import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UpdateDetail from './UpdateDetail';
import UpdateOption from './UpdateOption';
import ProductImages from './UpdateImage';

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

export default function UpdateProduct() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',display:"flex", justifyContent:"center" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{textTransform:"initial"}} label=" Cập nhật thông tin sản phẩm" {...a11yProps(0)} />
          <Tab sx={{textTransform:"initial"}} label=" Cập nhật tùy chọn và tiện ích" {...a11yProps(1)} />
          <Tab sx={{textTransform:"initial"}} label="Cập nhật các hình ảnh khác" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UpdateDetail></UpdateDetail>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UpdateOption></UpdateOption>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ProductImages></ProductImages>
      </CustomTabPanel>
    </Box>
  );
}
