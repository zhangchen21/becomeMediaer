import { Input, Form, Button, Radio } from "antd";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import './index.scss';
import { getData } from "./api/api";
import { useState } from "react";

const TouTiaoNew = () => {
	const [form] = Form.useForm();
	const target = Form.useWatch("target", form);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		setLoading(true);
		const data = await getData(target);
		form.setFieldsValue(data);
		setLoading(false);
	}

	return (
		<div className="page">
			<Form className="form" form={form} initialValues={{target: "media"}}>
				<Form.Item label="目标" name="target">
					<Radio.Group buttonStyle="solid" >
						<Radio.Button value="media">赚钱</Radio.Button>
						<Radio.Button value="health">养生</Radio.Button>
						<Radio.Button value="cars">汽车</Radio.Button>
					</Radio.Group>
				</Form.Item>
				<Form.Item label="标题" name="title">
					<Input.TextArea autoSize={{minRows: 2, maxRows: 2}}/>
				</Form.Item>
				<Form.Item label="内容" name="content">
					<ReactQuill theme="snow" className="myEditor"/>
				</Form.Item>
				<Button type="primary" onClick={onSubmit} style={{margin: '0 auto'}} loading={loading}>获取</Button>
			</Form>
		</div>
	)
}

export default TouTiaoNew;