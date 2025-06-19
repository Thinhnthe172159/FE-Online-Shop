import React, { useState, useEffect } from "react";
import "./header.scss";
import { Button, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const SearchFunction = ({ search, setSearch, searchResults,navigate }) => {
  const handleSearch = (name, type) => {
    console.log("So sanh: "+type === "shop" )
    if (type === "shop") {
      navigate("/search?key=" + name + "&type=shop");
    } else {
      navigate("/search?key=" + name + "&type=product");
    }
  };


  if (search !== "") {
    return (
      <div id="search-function">
        <div className="search-content mt-3 px-3" style={{ maxHeight: "300px" }}>
          <Stack>
            <h5>Tìm kiếm sản phẩm</h5>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <Stack
                    key={index}
                    className="mt-2"
                    direction={"row"}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Stack direction={"row"} spacing={1}>
                      <SearchIcon sx={{ color: "black" }} />
                      <Typography variant="body1" color="initial">
                        {item.name}
                      </Typography>
                    </Stack>
                    <div onClick={()=> {
                      console.log('sadasdsadsa')
                      handleSearch(item.name, item.type);
                      } }>
                      <Typography className="search-label" variant="body1" color="initial">
                        {item.type === "product" ? "Tìm sản phẩm" : "Tìm shop"}
                      </Typography>
                    </div>
                  </Stack>
                ))
              ) : (
                <div>Không tìm thấy sản phẩm</div>
              )}
            </div>
          </Stack>
        </div>
      </div>
    );
  }

  return null;
};

export default SearchFunction;
