import { Input, Form, Button } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import './index.scss';
import { test } from "./components/test";

const TouTiaoNew = () => {
	const [form] = Form.useForm();

	const getData = async () => {
		// GitHub的原始文件API端点格式  
		// https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path-to-file>  
		const url = 'https://raw.githubusercontent.com/zhangchen21/becomeMediaer/master/.gitignore';  
			
		fetch(url)  
			.then(response => {  
				if (!response.ok) {  
					throw new Error(`HTTP error! Status: ${response.status}`);  
				}  
				return response.text();  
			})  
			.then(text => {  
				return text;  
			})  
			.catch(error => {  
				console.error('请求文件出错:', url, error);  
			});
		return {
			title: "最被低估的延寿运动！很多人都锻炼错了",
			content: test
		}
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
				<Button type="primary" onClick={onSubmit}>提交</Button>
			</Form>
		</div>
	)
}

export default TouTiaoNew;