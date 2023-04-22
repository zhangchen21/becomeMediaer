import { Menu } from "antd";
import {
  HomeOutlined,
  ZhihuOutlined
} from "@ant-design/icons";
import { FC, useState } from "react";
import type { MenuProps } from 'antd';
import { useNavigate } from "react-router-dom";

const items: MenuProps['items'] = [
  {
    label: '首页',
    key: '/homepage',
    icon: <HomeOutlined />,
  },
  {
    label: '知乎',
    key: '/zhihu',
    icon: <ZhihuOutlined />,
  },
];

const Navbar: FC= () => {
  let navigate = useNavigate();
  const [current, setCurrent] = useState('/homepage');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  }

  return (
    <Menu 
      onClick={onClick} 
      selectedKeys={[current]}
      style={{ minWidth: 0, flex: "auto" }}
      mode="horizontal" 
      items={items} />
  );
};

export default Navbar;
