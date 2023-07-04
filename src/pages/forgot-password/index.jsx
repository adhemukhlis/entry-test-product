import { Button, Card, Col, Form, Input, Row, Typography, message } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

const { Title } = Typography

const Forgot = () => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const [form] = Form.useForm()
	const onFinish = async (values) => {
		setLoading(true)
		return await axios
			.request({
				method: 'post',
				url: '/api/auth/forgot-password',
				data: {
					...values,
					callback_url: window.location.origin + '/forgot-password/reset/' + values.email
				}
			})
			.then((res) => {
				if (res.status === 200) {
					message.success(res.data.message, 5)
					form.resetFields()
				}
			})
			.catch((err) => {
				message.error(err?.response?.data?.message, 5)
			})
			.finally(() => {
				setLoading(false)
			})
	}
	return (
		<Row justify={'center'} align="middle" style={{ minHeight: '100vh', width: '100%' }}>
			<Col {...{ sm: 22, md: 16, lg: 10 }}>
				<Card>
					<Title level={3}>Forgot Password</Title>
					<Form
						form={form}
						labelCol={{
							span: 4
						}}
						wrapperCol={{
							span: 20
						}}
						onFinish={onFinish}
						autoComplete="off"
						colon={false}
						disabled={loading}>
						<Form.Item
							label="Email"
							name="email"
							rules={[{ type: 'email', required: true, message: 'Please input your email!' }]}>
							<Input placeholder="Input your email" />
						</Form.Item>
						<Form.Item
							wrapperCol={{
								offset: 4,
								span: 20
							}}>
							<div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '0.8rem' }}>
								<Button type="primary" htmlType="submit" loading={loading}>
									Send
								</Button>
								<Button disabled={loading} onClick={() => router.push('/login')}>
									Back to Login
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	)
}
export default Forgot
