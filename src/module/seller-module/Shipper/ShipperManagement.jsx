import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

const ShipperManagement = () => {
  const [shippers, setShippers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchShippers();
  }, []);

  const fetchShippers = async () => {
    try {
      const response = await axios.get("/api/shipper/all");
      setShippers(response.data);
    } catch (error) {
      console.error("Failed to fetch shippers", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/shipper/search?name=${searchTerm}`);
      setShippers(response.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/shipper/status/${id}`, { status: currentStatus ? 0 : 1 });
      fetchShippers();
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/2"
            />
            <Button onClick={handleSearch}>Search</Button>
            <Button onClick={fetchShippers} variant="secondary">
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {shippers.map((shipper) => (
                  <tr key={shipper.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{shipper.id}</td>
                    <td className="px-4 py-2">{shipper.name}</td>
                    <td className="px-4 py-2">{shipper.email}</td>
                    <td className="px-4 py-2">{shipper.phone}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`font-semibold ${
                          shipper.status === 1 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {shipper.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Switch
                        checked={shipper.status === 1}
                        onCheckedChange={() => toggleStatus(shipper.id, shipper.status)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipperManagement;
