import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "12345" && password === "12345") {
      localStorage.setItem("isAdminLoggedIn", "true");
      message.success("Login Successful!");
      navigate("/admin");
    } else {
      message.error("Invalid Credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <Card className="w-96 shadow-2xl rounded-2xl p-6">
        <div className="text-center mb-6">
          <Title level={2} className="text-indigo-600">Super Admin</Title>
          
        </div>

        <div className="space-y-4">
          <Input
            size="large"
            placeholder="Username"
            prefix={<UserOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg"
          />
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<LockOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg"
          />
          <Button
            type="primary"
            size="large"
            block
            onClick={handleLogin}
            className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;