import { FC } from 'react';
import { List, Typography, } from 'antd';
import {
	MoneyCollectOutlined,
  } from "@ant-design/icons";
import './Redenvelope.scss'

interface Redenvelope {
	questions: {
		[key: string]: string
	},
	className: string
}

const { Paragraph } = Typography;

const Redenvelope: FC<Redenvelope> = ({ questions, className }) => {

	return (
		<div style={{width: "1500px"}}>
			<List
				header={<div style={{fontWeight: "bold", fontSize: "16px"}}><MoneyCollectOutlined /> 最新红包问题</div>}
				bordered
				size="large"
				className={className}
				dataSource={Object.keys(questions)}
				renderItem={(item) => (
					<List.Item>
						<div style={{display: "flex", justifyContent: "space-between"}}>
							<Paragraph 
								copyable 
								onClick={() => window.open(questions[item])}
								className='listItem'
							>
								{item}
							</Paragraph>
						</div>
					</List.Item>
				)}
			/>
		</div>
	)
}

export default Redenvelope;