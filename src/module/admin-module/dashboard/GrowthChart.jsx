import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GrowthChart = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Lọc dữ liệu theo năm
    const filtered = data.filter(item => {
      const year = new Date(item.transactionDate).getFullYear();
      return year === selectedYear;
    });
    setFilteredData(filtered);
  }, [selectedYear, data]);

  if (!filteredData || filteredData.length === 0) {
    return <Typography>Không có dữ liệu để hiển thị</Typography>;
  }

  const labels = filteredData.map(item => item.transactionDate);
  const dailyIncome = filteredData.map(item => item.dailyIncome);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Thu nhập hàng ngày',
        data: dailyIncome,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ thu nhập hàng ngày',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const formatter = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            });
            return formatter.format(tooltipItem.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Thu nhập (VND)',
        },
        ticks: {
          callback: (value) => {
            const formatter = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            });
            return formatter.format(value);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Ngày trong tháng',
        },
        ticks: {
          minRotation: 0,
          maxRotation: 0,
        },
      },
    },
  };

  const years = Array.from(new Set(data.map(item => new Date(item.transactionDate).getFullYear())));

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Thu nhập hàng ngày</Typography>
      
      <FormControl fullWidth>
        <InputLabel>Năm</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          label="Năm"
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Bar data={chartData} options={options} />
    </Paper>
  );
};

export default GrowthChart;
