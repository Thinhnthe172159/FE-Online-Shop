import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AddShipperForm({ onSubmit }) {
  const [shipper, setShipper] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setShipper({ ...shipper, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(shipper);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="space-y-4 py-6">
        <h2 className="text-xl font-semibold">Thêm Shipper</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Tên shipper"
            value={shipper.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={shipper.email}
            onChange={handleChange}
            required
          />
          <Input
            name="phone"
            placeholder="Số điện thoại"
            value={shipper.phone}
            onChange={handleChange}
            required
          />
          <Input
            name="address"
            placeholder="Địa chỉ"
            value={shipper.address}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
            Thêm mới
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
