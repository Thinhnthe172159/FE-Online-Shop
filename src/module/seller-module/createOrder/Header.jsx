import React from "react";
import {
  Box,
  Tab,
  IconButton,
  Stack,
  Typography,
  InputBase,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import ReplyAllOutlinedIcon from "@mui/icons-material/ReplyAllOutlined";
import { useNavigate } from "react-router-dom";
const TabComponent = ({
  tabs,
  activeTab,
  onAddTab,
  onTabClick,
  onTabClose,
}) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ backgroundColor: "#0070f4", padding: "10px 10px 0px 10px" }}>
      <Stack direction={"row"} spacing={3}>
        <Box
          sx={{
            borderRadius: "50%",
            width: "25px",
            height: "25px",
          }}
        >
          <IconButton onClick={()=> navigate("/seller/order")} sx={{ color: "#FFFFFF" }}>
            <ReplyAllOutlinedIcon />
          </IconButton>
        </Box>
        <Box sx={{ backgroundColor: "#0070f4", padding: "5px" }}>
          <Stack direction={"row"} spacing={3}>
            <Box
              sx={{
                backgroundColor: "#f0f1f3",
                width: "400px",
                display: "flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: "16px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <Search sx={{ marginRight: "8px" }} />
              <InputBase
                placeholder="Tìm hàng hóa (F3)"
                sx={{
                  flex: 1,
                  fontSize: "0.9rem",
                  padding: "2px 0",
                }}
              />
            </Box>
          </Stack>
        </Box>
        <Stack direction={"row"} sx={{ alignItems: "end" }}>
          {/* Render tabs dynamically */}
          {tabs.map((tab) => (
            <Box
              key={tab.id}
              sx={{
                backgroundColor: tab.id === activeTab ? "#f0f1f3" : "#0070f4",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Tab
                label={
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => onTabClick(tab.id)}
                  >
                    <ListAltIcon
                      style={{
                        marginRight: 8,
                        color: tab.id === activeTab ? "#0070f4" : "wheat",
                      }}
                    />
                    <Typography
                      sx={{
                        textTransform: "initial",
                        color: tab.id === activeTab ? "black" : "white",
                        fontWeight: "700",
                      }}
                      variant="body1"
                    >
                      {tab.label}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabClose(tab.id);
                      }}
                      style={{
                        marginLeft: 8,
                        color: tab.id === activeTab ? "#000000" : "white",
                        padding: "1px",
                      }}
                    >
                      <Close sx={{ fontSize: "19px" }} />
                    </IconButton>
                  </div>
                }
                disableRipple
                sx={{
                  minWidth: "",
                  padding: "0 12px",
                  "& .MuiTab-wrapper": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              />
            </Box>
          ))}

          {/* Add Tab Button */}
          <Box
            sx={{
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              display: "flex",
              lineHeight: "20px",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "15px",
              marginBottom: "10px",
              border: "2px solid white",
            }}
          >
            <IconButton onClick={onAddTab} sx={{ color: "#FFFFFF" }}>
              <AddIcon />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TabComponent;
