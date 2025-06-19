import {
  Box,
  Divider,
  LinearProgress,
  Rating,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import FeebackContent from "./FeebackContent";
import FeedBackNotFound from "./FeedBackNotFound";
import { fetch } from "../../../api/Fetch";

const FeedBack = ({ id }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [feedbackPercentages, setFeedbackPercentages] = useState([]);
  const [filterRating, setFilterRating] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        if (id && token) {
          const response = await fetch.get(`/feedback/getAllFeedBack/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFeedbackData(response.data || []);
          setFilteredData(response.data || []);
        } else {
          setError("Missing product ID or token.");
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
        setFeedbackData([]);
        setError(error.message);
      }
    };

    const fetchAvgRating = async () => {
      try {
        if (id && token) {
          const response = await fetch.get(`/feedback/get-avg/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (typeof response.data === "number") {
            setAvgRating(response.data);
          } else {
            setAvgRating(0);
          }
        } else {
          setError("Missing product ID or token.");
        }
      } catch (error) {
        console.error("Error fetching average feedback:", error);
        setAvgRating(0);
        setError(error.message);
      }
    };

    const fetchFeedbackPercentages = async () => {
      try {
        if (id && token) {
          const response = await fetch.get(`/feedback/getPercent/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFeedbackPercentages(response.data || []);
        } else {
          setError("Missing product ID or token.");
        }
      } catch (error) {
        console.error("Error fetching feedback percentages:", error);
        setFeedbackPercentages([]);
        setError(error.message);
      }
    };

    fetchFeedbackData();
    fetchAvgRating();
    fetchFeedbackPercentages();
  }, [id, token]);

  useEffect(() => {
    if (filterRating === null) {
      setFilteredData(feedbackData);
    } else {
      setFilteredData(feedbackData.filter(feedback => feedback.rating === filterRating));
    }
  }, [filterRating, feedbackData]);

  const handleRatingFilterChange = (event, newRating) => {
    if (newRating !== null) {
      setFilterRating(newRating);
    } else {
      setFilterRating(null);
    }
  };

  return (
    <div id="feedback">

      <div className="feedback-head">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Đánh giá
          </Typography>
          <Divider
            sx={{
              flexGrow: 1,
              marginLeft: "10px",
              borderBottom: "2px solid black",
            }}
          />
        </Box>
      </div>

      <div className="feedback-body">
        <Stack direction={"row"} spacing={3}>
          <div
            className="feedback-rating"
            style={{
              width: "25%",
              padding: "30px 20px",
              backgroundColor: "#f5f5f5", 
              borderRadius: "8px",
            }}
          >
            <div className="feedback-rating-head">
              <Stack
                direction={"row"}
                sx={{ alignItems: "center", justifyContent: "center" }}
                spacing={1}
              >
                <h2 style={{ fontSize: "100px" }} className="mb-0">
                  {avgRating === 0 ? avgRating : avgRating.toFixed(1)}
                </h2>
                <Stack>
                  <Rating name="read-only" value={avgRating} precision={0.1} readOnly />
                </Stack>
              </Stack>
            </div>

            <div className="feedback-rating-bottom">
              {[5, 4, 3, 2, 1].map((rating) => {
                const feedback = feedbackPercentages.find(
                  (item) => item.feedBack_rating === rating
                );
                const percentage = !isNaN(feedback?.feedBack_percentage) ? Math.round(feedback?.feedBack_percentage) : 0; 

                return (
                  <Stack
                    key={rating}
                    direction={"row"}
                    spacing={3}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      sx={{ alignItems: "center" }}
                      spacing={1}
                    >
                      <Typography
                        sx={{ color: "#1b1b1b", fontSize: "18px" }}
                        variant="h5"
                        color="initial"
                      >
                        {rating}
                      </Typography>
                      <StarIcon sx={{ color: "orange" }} />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ width: "50%", backgroundColor: "gray" }}
                    />
                    <Typography
                      sx={{ color: "#1b1b1b", fontSize: "18px" }}
                      width={"20%"}
                      variant="h6"
                      color="initial"
                    >
                      {percentage}% 
                    </Typography>
                  </Stack>
                );
              })}
            </div>

          </div>

          <div style={{ width: "75%" }} className="feedback-content">
            <div className="feedback-content-head">
              <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
                <Stack>
                  <ToggleButtonGroup
                    value={filterRating}
                    exclusive
                    onChange={handleRatingFilterChange}
                    aria-label="Lựa chọn sản phẩm"
                    sx={{
                      display: "flex",
                      gap: "10px",
                      "& .MuiToggleButton-root": {
                        padding: "10px 20px",
                        borderRadius: "999px",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        textTransform: "capitalize",
                        "&.Mui-selected": {
                          backgroundColor: "#fffae9",
                          color: "#ffcf20",
                          borderColor: "#ffcf20",
                        },
                        "&:hover": {
                          backgroundColor: "#fffae9",
                          color: "#ffcf20",
                          borderColor: "#ffcf20",
                        },
                      },
                    }}
                  >
                    <ToggleButton value={null}>Tất cả</ToggleButton>
                    <ToggleButton value={5}>
                      5 <StarIcon sx={{ color: "orange" }} />
                    </ToggleButton>
                    <ToggleButton value={4}>
                      4 <StarIcon sx={{ color: "orange" }} />
                    </ToggleButton>
                    <ToggleButton value={3}>
                      3 <StarIcon sx={{ color: "orange" }} />
                    </ToggleButton>
                    <ToggleButton value={2}>
                      2 <StarIcon sx={{ color: "orange" }} />
                    </ToggleButton>
                    <ToggleButton value={1}>
                      1 <StarIcon sx={{ color: "orange" }} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Stack>
              {filteredData.length > 0 ? (
                <FeebackContent id={id} data={filteredData} />
              ) : (
                <FeedBackNotFound />
              )}
            </div>
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default FeedBack;
