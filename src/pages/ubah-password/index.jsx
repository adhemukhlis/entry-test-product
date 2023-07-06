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
		const { old_password, new_password } = values
		setLoading(true)
		return await axios
			.request({
				method: 'post',
				url: '/api/auth/ubah-password',
				data: {
					old_password,
					new_password
				}
			})
			.then((res) => {
				if (res.status === 200) {
					message.success(res.data.data.msg, 5)
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
					<Title level={3}>Ubah Password</Title>
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
						disabled={loading}
						labelAlign="left">
						<Form.Item
							label="Password Lama"
							name="old_password"
							rules={[{ type: 'string', required: true, message: 'Please input your password!' }]}>
							<Input.Password />
						</Form.Item>
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
										return Promise.reject(new Error('The confirm passwords that you entered do not match with new password!'))
									}
								})
							]}>
							<Input.Password />
						</Form.Item>
						<Form.Item
							wrapperCol={{
								offset: 4,
								span: 20
							}}>
							<div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '0.8rem' }}>
								<Button type="primary" htmlType="submit" loading={loading}>
									Simpan
								</Button>
								<Button disabled={loading} onClick={() => router.back()}>
									Back
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
