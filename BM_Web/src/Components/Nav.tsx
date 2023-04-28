import { Menu } from "antd";
import {
  HomeOutlined,
  ZhihuOutlined
} from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";

const items: MenuProps['items'] = [
  {
    label: '首页',
    key: '/homepage',
    icon: <HomeOutlined />,
  },
  {
    label: '好物推荐',
    key: '/zhihu/goods',
    icon: <ZhihuOutlined />,
  },
  {
    label: '红包问题',
    key: '/zhihu/redenvelope',
    icon: <ZhihuOutlined />,
  },
];

const Navbar: FC= () => {
  let navigate = useNavigate();
  
  const location = 
    useLocation()
    .pathname
    .match(/.*?(?<path>\/[^\?]*)/)
    ?.groups
    ?.path 
    ?? "/homepage";

  const [current, setCurrent] = useState(location);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  }

  useEffect(() => {
    setCurrent(location);
  }, [location])

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
