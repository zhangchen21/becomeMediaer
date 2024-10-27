import { Input, Form, Button } from "antd";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import './index.scss';
import { getData } from "./api/api";

const TouTiaoNew = () => {
	const [form] = Form.useForm();

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