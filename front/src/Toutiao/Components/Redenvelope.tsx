import { FC, useState, useEffect } from 'react';
import { List, Typography, } from 'antd';
import {
	MoneyCollectOutlined,
	CopyOutlined,
  } from "@ant-design/icons";
import './Redenvelope.scss'
import axios from 'axios';

interface Redenvelope {
	news: News[];
	className: string
}

interface News {
	text: string,
	img: string
}

const { Paragraph } = Typography;

let allNews:string[] = [];

const Redenvelope: FC<Redenvelope> = ({ className }) => {
	const [news, setNews] = useState<News[]>([]); // 用于存储新闻标题数组
	const [loading, setLoading] = useState(false); // 用于标识是否正在加载数据
  
	const fetchData = async () => {
	  setLoading(true); // 设置加载状态为true
	  try {
		const response = await axios.get('http://localhost:3000/getNews');
		setNews(response.data); // 设置新闻标题数组
		allNews = response.data;
	  } catch (error) {
		console.error('获取新闻失败:', error);
	  }
	  setLoading(false); // 设置加载状态为false
	};
  
	useEffect(() => {
	  // 当组件挂载时获取新闻数据
	  fetchData()
	  const intervalId = setInterval(fetchData, 3600000);
  
	  return () => clearInterval(intervalId);
	}, []); // 空依赖数组意味着这个effect只在组件挂载时运行一次

	const handleCopy = async (text:string) => {
		try {
		  await navigator.clipboard.writeText(text);
		  // 可以在这里添加提示逻辑，例如使用Antd的message组件
		  console.log('内容复制成功！');
		} catch (err) {
		  console.error('内容复制失败：', err);
		}
	  };

	return (
		<div style={{width: "1500px"}}>
			<List
				header={<div style={{fontWeight: "bold", fontSize: "16px"}}><MoneyCollectOutlined /> 最新红包问题</div>}
				bordered
				size="large"
				className={className}
				dataSource={news}
				renderItem={(item, i) => (
					<List.Item>
						<div style={{display: "flex", justifyContent: "space-between"}}>
							<Paragraph 
								className='listItem'
								copyable
								onClick={() => {handleCopy(item.text); setNews(news.slice(1))}} 
							>
								{item.text}
							</Paragraph>
							<img src={item.img} />
						</div>
					</List.Item>
				)}
			/>
		</div>
	)
}

export default Redenvelope;

