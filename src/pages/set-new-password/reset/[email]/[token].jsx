import React from 'react'
import { Button, Card, Col, Form, Input, Row, Typography, message } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router'
const { Title } = Typography
function NewPassword() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const onFinish = async (values) => {
		setLoading(true)
		return await axios
			.request({
				method: 'post',
				url: '/api/auth/forgot-password-reset',
				data: {
					...values,
					email: router.query.email,
					token: router.query.token
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
			<Col {...{ sm: 22, md: 18, lg: 12 }}>
				<Card>
					<Title level={3}>Set New Password</Title>
					<Form
						form={form}
						labelCol={{
							span: 8
						}}
						wrapperCol={{
							span: 16
						}}
						onFinish={onFinish}
						autoComplete="off"
						colon={false}
						disabled={loading}>
						<Form.Item
							label="New Password"
							name="new_password"
							rules={[{ type: 'string', required: true, message: 'Please input your password!' }]}>
							<Input.Password />
						</Form.Item>
						<Form.Item
							name="confirm_password"
							label="Confirm Password"
							dependencies={['new_password']}
							hasFeedback
							rules={[
								{
									required: true,
									message: 'Please confirm your password!'
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('new_password') === value) {
											return Promise.resolve()
										}
										return Promise.reject(new Error('The two passwords that you entered do not match!'))
									}
								})
							]}>
							<Input.Password />
						</Form.Item>
						<Form.Item
							wrapperCol={{
								offset: 8,
								span: 16
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

export default NewPassword
