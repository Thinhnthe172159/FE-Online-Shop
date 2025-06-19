import React, { useState, useEffect } from 'react';
import SearchFunction from './SearchFunction';
import { Box, Button, Stack } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import useDebounce from './UseDebounce';

const SearchBar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  const [isFocused, setIsFocused] = useState(false); // Track input focus
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key") || "";
  useEffect(() => {
    if (key) {
      setSearch(key);  // Set search to the `key` from URL when the component loads
    }
  }, [key]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  
  const handleNavigate = () => {
    if (search !== "") {
      let key = search;
      setSearch("");
      navigate("/search?key=" + key);
    }else {
      navigate("/search")
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`http://localhost:8080/product/search?name=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const filteredResults = response.data.data.filter(product => product.status !== "0");
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <Box

      sx={{
        width: "50%",
        border: "solid #ccc 1px",
        borderRadius: "999px",
        paddingLeft: "10px",
        backgroundColor: "white",
        position: "relative",
        transition: "filter 0.3s",  // Smooth transition for blur
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Conditionally render SearchFunction */}
        {isFocused && <SearchFunction setSearch={setSearch} search={search} searchResults={searchResults} navigate={navigate}/>}
        
        <input
          onFocus={() => setIsFocused(true)}   // When input is focused, set isFocused to true
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
            }, 100)}}   // When input loses focus, set isFocused to false
          onChange={handleSearch}
          style={{
            width: "70%",
            border: "none",
            outline: "none",
            boxShadow: "none",
            height: "45px",
            marginLeft: '10px',
          }}
          placeholder="Nhập từ khóa cần tìm"
          type="text"
          className="my-0"
          value={search }
        />
        
        <Button
          sx={{
            borderRadius: "999px",
            backgroundColor: "#ffcf20",
            color: "#1b1b1b",
            textTransform: "capitalize",
            fontWeight: "600",
            padding: "8px 30px",
            position: "absolute",
            right: "5px",
          }}
          onClick={handleNavigate}
        >
          Tìm kiếm
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchBar;
