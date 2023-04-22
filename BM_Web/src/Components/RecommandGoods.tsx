import { FC } from 'react';
import { List, Button, Typography, } from 'antd';
import {
	CopyOutlined,
} from "@ant-design/icons";

interface RecommandGoods {
	products: string[],
	className: string
}

const { Paragraph } = Typography;

const RecommandGoods: FC<RecommandGoods> = ({ products, className }) => {
	console.log(products)

	return (
		<div>
			<List
				header={<div style={{fontWeight: "bold"}}>推荐好物</div>}
				bordered
				size="small"
				className={className}
				dataSource={products}
				renderItem={(item) => (
					<List.Item>
						<div style={{display: "flex", justifyContent: "space-between", width: "300px"}}>
							<Paragraph copyable>{item}</Paragraph>
							{/* <Button 
								type="primary" 
								shape="circle" 
								icon={<CopyOutlined />}
							/>							 */}
						</div>
					</List.Item>
				)}
			/>
		</div>
	);
}

export default RecommandGoods;