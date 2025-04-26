import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/Dashboard";
import Header from "./Header";


type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const Layout: React.FC<{}> = ({}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();


  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        navigate("/");
        break;
      case "2":
        navigate("/login");
        break;
      case "3":
        navigate("/register");
        break;
      default:
        break;
    }
  };

  const items: MenuItem[] = [
    getItem("Home", "1", <PieChartOutlined />),
    getItem("Login", "2", <DesktopOutlined />),
    getItem("Register", "3", <FileOutlined />),
    getItem("User", "sub1", <UserOutlined />, [
      getItem("Tom", "4"),
      getItem("Bill", "5"),
      getItem("Alex", "6"),
    ]),
    getItem("Team", "sub2", <TeamOutlined />, [
      getItem("Team 1", "7"),
      getItem("Team 2", "8"),
    ]),
    getItem("Files", "9", <FileOutlined />),
  ];

  return (
    <>
  <body className="bg-gray-50 dark:bg-neutral-900">
  <Header/>

  

  <Sidebar/>




  </body>
    </>
  );
};

export default Layout;
