import { Input, Form, Button } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import { convertToHtml } from 'mammoth'; 
import 'react-quill/dist/quill.snow.css'
import './index.scss';
import { test } from "./components/test";

const TouTiaoNew = () => {
	const [form] = Form.useForm();

	const getData = async () => {
		const url = 'http://localhost:3000/random-docx';  
			
		const res = await(await fetch(url)).json();
		if(res?.code === 0) {
			return res.data;
		}
		return {}
	}

	const onSubmit = async () => {
		const data = await getData();
		form.setFieldsValue(data);
	}

	return (
		<div className="page">
			<Form className="form" form={form}>
				<Form.Item label="标题" name="title">
					<Input.TextArea autoSize={{minRows: 2, maxRows: 2}}/>
				</Form.Item>
				<Form.Item label="内容" name="content">
					{/* <Input.TextArea autoSize={{minRows: 20, maxRows: 20}}/> */}
					<ReactQuill theme="snow" className="myEditor"/>
				</Form.Item>
				<Button type="primary" onClick={onSubmit} style={{margin: '0 auto'}}>获取</Button>
			</Form>
		</div>
	)
}

export default TouTiaoNew;