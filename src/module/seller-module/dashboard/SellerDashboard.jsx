import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { RiFeedbackLine } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import ReactApexChart from "react-apexcharts";
import ChartTransactionUser from "./chart";
import { fetch } from "../../../api/Fetch";
import "./sellerdashboard.scss";

const ECommerce = () => {
  const [income, setIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [incomeExpenseSeries, setIncomeExpenseSeries] = useState([0, 0]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [quantity,setQuantity] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseTrans, responseOrders,responseQuantity] = await Promise.all([
          fetch.get("/shop-transaction/get-all"),
          fetch.get("/order/getAll"),
          fetch.get('/order/getQuantity'),
        ]);
        
        const transactions = responseTrans.data.data;
        const orders = responseOrders.data.data;
        const quan = responseQuantity.data.data;
        setQuantity(quan)
        // Calculate net income
        const netRevenue = transactions.reduce((total, transaction) => {
          return transaction.type === 1
            ? total + transaction.amount
            : total - transaction.amount;
        }, 0);
        setIncome(netRevenue);

        // Calculate monthly income
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = transactions
          .filter((transaction) => {
            const date = new Date(transaction.create_at);
            return (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear
            );
          })
          .reduce((total, transaction) => {
            return transaction.type === 1
              ? total + transaction.amount
              : total - transaction.amount;
          }, 0);
        setMonthlyIncome(monthlyRevenue);

        // Recent transactions for notifications
        const sortedTransactions = transactions
          .sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
          .slice(0, 4);
        setRecentTransactions(sortedTransactions);

        // Calculate total income and expense amounts
        const totalIncome = transactions
          .filter(t => t.type === 1)
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
          .filter(t => t.type !== 1)
          .reduce((sum, t) => sum + t.amount, 0);

        const totalAmount = totalIncome + totalExpense;

        // Calculate percentages for income vs. expense
        if (totalAmount > 0) {
          setIncomeExpenseSeries([
            (totalIncome / totalAmount) * 100,
            (totalExpense / totalAmount) * 100
          ]);
        }

        // Calculate total orders and monthly orders
        setTotalOrders(orders.length);
        const monthlyOrdersCount = orders.filter((order) => {
          const date = new Date(order.create_at);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        }).length;
        setMonthlyOrders(monthlyOrdersCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ApexChart options for income vs. expense
  const incomeExpenseOptions = {
    chart: { type: "donut" },
    labels: ["Thu nhập", "Chi tiêu"],
    legend: { position: "bottom" },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    tooltip: {
      y: {
        formatter: (_val, { seriesIndex }) => `${incomeExpenseSeries[seriesIndex].toFixed(1)}%`
      }
    }
  };

  return (
    <div className="ecommerce-container">
      <div className="top-cards">
        <Card className="card yellow-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Tổng doanh thu</Typography>
            <Typography variant="h4" className="card-value">
              {income.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Typography>
          </CardContent>
          <RiFeedbackLine className="icon yellow-icon" />
        </Card>

        <Card className="card green-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Doanh thu tháng hiện tại</Typography>
            <Typography variant="h4" className="card-value">
              {monthlyIncome.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Typography>
          </CardContent>
          <RiFeedbackLine className="icon green-icon" />
        </Card>

        <Card className="card red-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Tổng số đơn</Typography>
            <Typography variant="h4" className="card-value">
              {totalOrders}
            </Typography>
          </CardContent>
          <FiFileText className="icon red-icon" />
        </Card>

        <Card className="card blue-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Đơn hàng tháng hiện tại</Typography>
            <Typography variant="h4" className="card-value">
              {monthlyOrders}
            </Typography>
          </CardContent>
          <FiFileText className="icon blue-icon" />
        </Card>
        <Card className="card purple-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Số lượng hàng đã bán</Typography>
            <Typography variant="h4" className="card-value">
              {quantity}
            </Typography>
          </CardContent>
          <AiOutlineArrowUp className="icon purple-icon" />
        </Card>
      </div>

      <div className="chart-notification-section">
        <div className="chart-container">
          <ChartTransactionUser />
        </div>

        <div className="notification-card">
          <Card className="notification-content">
            <CardContent>
              <Typography variant="h6" className="notification-title">Thông báo</Typography>
              {recentTransactions.map((transaction, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  {transaction.type === 1 ? (
                    <AiOutlineArrowUp className="icon income-icon" />
                  ) : (
                    <AiOutlineArrowDown className="icon expense-icon" />
                  )}
                  <Typography variant="body2" className="notification-item">
                    {`Giao dịch ${transaction.type === 1 ? "thu nhập" : "chi tiêu"
                      }: `}
                    <span
                      className={`amount ${transaction.type === 1 ? "income" : "expense"
                        }`}
                    >
                      {transaction.amount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    {` vào ngày ${new Date(transaction.create_at).toLocaleDateString(
                      "vi-VN"
                    )}`}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card className="chart-card">
            <CardContent>
              <Typography variant="h6" className="chart-title">Tỷ lệ thu nhập và chi tiêu</Typography>
              <ReactApexChart options={incomeExpenseOptions} series={incomeExpenseSeries} type="donut" height={300}/>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
