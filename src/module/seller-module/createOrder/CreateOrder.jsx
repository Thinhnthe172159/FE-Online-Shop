import React, { useState } from "react";
import Header from "./Header";

import "./create-order.scss";
import CreateOrderDetail from "./CreateOrderDetail";

const CreateOrder = () => {
  const [tabs, setTabs] = useState([{ id: 1, label: "Hóa đơn 1" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [orderData, setOrderData] = useState({
    1: { detail: "" }, // Initial data for the first tab
  });
  const [nextTabId, setNextTabId] = useState(2);

  const handleAddTab = () => {
    const newTabId = nextTabId;
    setTabs((prevTabs) => [...prevTabs, { id: newTabId, label: `Hóa đơn ${newTabId}` }]);
    setOrderData((prevData) => ({
      ...prevData,
      [newTabId]: { detail: "" }, // Initialize data for the new tab
    }));
    setNextTabId((prevId) => prevId + 1);
    setActiveTab(newTabId); // Set the new tab as active
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  const handleTabClose = (id) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    setOrderData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[id];
      return updatedData;
    });
    // Automatically switch to another tab if active tab is closed
    if (activeTab === id && tabs.length > 1) {
      const remainingTabs = tabs.filter((tab) => tab.id !== id);
      setActiveTab(remainingTabs[0].id);
    }
  };

  const handleDataChange = (field, value) => {
    setOrderData((prevData) => ({
      ...prevData,
      [activeTab]: {
        ...prevData[activeTab],
        [field]: value,
      },
    }));
  };

  return (
    <div style={{ backgroundColor: "#f0f1f3", minHeight: "100vh" }}>
      <Header
        tabs={tabs}
        activeTab={activeTab}
        onAddTab={handleAddTab}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
      />
      <div style={{ padding: "20px" }}>
        {/* Render the CreateOrderDetail component for the active tab */}
        {tabs.map((tab) =>
          tab.id === activeTab ? (
            <CreateOrderDetail
              key={tab.id}
              data={orderData[tab.id]}
              onChange={handleDataChange}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default CreateOrder;
