import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Box, FormControl, MenuItem, Select, Typography, InputLabel } from "@mui/material";
import { fetch } from "../../../api/Fetch";

const ChartTransactionUser = () => {
    const [series, setSeries] = useState([
        {
            name: "Total Amount",
            data: Array(12).fill(0),
        },
    ]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [detailedView, setDetailedView] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0); 
    const [allTransactions, setAllTransactions] = useState([]);

    const calculateMaxY = () => {
        const maxAmount = Math.max(...series[0].data);
        const numDigits = Math.floor(Math.log10(maxAmount)) + 1;
        const roundFactor = Math.pow(10, numDigits - 1);
        const roundedMax = Math.ceil(maxAmount / roundFactor) * roundFactor;
        return roundedMax > 10 ? roundedMax : 10;
    };

    const options = {
        legend: { show: false, position: "top", horizontalAlign: "left" },
        colors: ["#3C50E0", "#80CAEE"],
        chart: {
            fontFamily: "Satoshi, sans-serif",
            height: 335,
            type: "area",
            dropShadow: { enabled: true, color: "#623CEA14", top: 10, blur: 4, left: 0, opacity: 0.1 },
            toolbar: { show: false },
            events: {
                dataPointSelection: (_event, _chartContext, config) => {
                    const monthIndex = config.dataPointIndex;
                    handleMonthClick(monthIndex);
                },
            },
        },
        responsive: [
            { breakpoint: 1024, options: { chart: { height: 300 } } },
            { breakpoint: 1366, options: { chart: { height: 350 } } },
        ],
        stroke: { width: [2, 2], curve: "straight" },
        grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
        dataLabels: { enabled: false },
        markers: {
            size: 4,
            colors: "#fff",
            strokeColors: ["#3056D3", "#80CAEE"],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            fillOpacity: 1,
            hover: { sizeOffset: 5 },
        },
        xaxis: {
            type: "category",
            categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { title: { style: { fontSize: "0px" } }, min: 0, max: calculateMaxY() },
        tooltip: {
            y: {
                formatter: (val) => `${val.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseTrans = await fetch.get("/shop-transaction/get-all");
                const transactions = responseTrans.data.data;
                setAllTransactions(transactions);

                const monthlyData = Array(12).fill(0);
                transactions.forEach((transaction) => {
                    const date = new Date(transaction.create_at);
                    const year = date.getFullYear();
                    const monthIndex = date.getMonth();
                    if (year === selectedYear && monthIndex >= 0 && monthIndex < 12) {
                        monthlyData[monthIndex] += transaction.type === 1 ? transaction.amount : -transaction.amount;
                    }
                });

                setSeries([{ name: "Tổng doanh thu", data: monthlyData }]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedYear]);

    const handleMonthClick = (monthIndex) => {
        setSelectedMonth(monthIndex);
        setDetailedView(true);

        const filteredData = allTransactions.filter((transaction) => {
            const date = new Date(transaction.create_at);
            return date.getFullYear() === selectedYear && date.getMonth() === monthIndex;
        });

        const dailyData = Array(31).fill(0);
        let monthlyTotalAmount = 0;

        filteredData.forEach((transaction) => {
            const date = new Date(transaction.create_at);
            const day = date.getDate() - 1;
            const adjustedAmount = transaction.type === 1 ? transaction.amount : -transaction.amount;
            dailyData[day] += adjustedAmount;
            monthlyTotalAmount += adjustedAmount;
        });

        setTotalAmount(monthlyTotalAmount); 
        setSeries([{ name: "Total Amount", data: dailyData }]);
    };

    return (
        <Box className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h5" className="text-center flex-grow">
                    {detailedView
                        ? `Details for ${(options.xaxis?.categories ?? [])[selectedMonth]} ${selectedYear} - Total Amount: ${totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                        : "Tổng doanh thu hàng tháng"}
                </Typography>
                <FormControl variant="outlined" className="-ml-5 mt-2">
                    <InputLabel>Năm</InputLabel>
                    <Select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setDetailedView(false);
                        }}
                        label="Year"
                    >
                        {[2022, 2023, 2024, 2025].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <div id="chartOne" className="-ml-5">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={350}
                    width={"100%"}
                />
            </div>
        </Box>
    );
};

export default ChartTransactionUser;
