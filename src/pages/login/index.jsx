import { Button, Card, Checkbox, Col, Form, Input, Row } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { withSession } from '@/utils/session-wrapper'
import routeGuard from '@/utils/route-guard'
import errorModal from '@/utils/error-modal'
import asyncLocalStorage from '@/utils/async-local-storage'

const LoginPage = () => {
	const router = useRouter()
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)
	const handleSubmit = async (values) => {
		setIsLoading(true)
		const { email, password, remember_me, captcha } = values
		axios
			.request({
				method: 'post',
				url: '/api/auth/login',
				data: { email, password, captcha }
			})
			.then((res) => {
				if (res.status === 200) {
					asyncLocalStorage.setItem('_am', res.data).then(() => {
						if (!!remember_me) {
							asyncLocalStorage.setItem('_rm', email)
						} else {
							asyncLocalStorage.setItem('_rm', '')
						}
						router.push('/')
					})
				}
			})
			.catch((err) => {
				errorModal(err)
				setIsLoading(false)
				form.setFieldValue('captcha', undefined)
			})
	}
	useEffect(() => {
		asyncLocalStorage.getItem('_rm').then((res) => {
			if (!!res) {
				form.setFieldValue('email', res)
				form.setFieldValue('remember_me', true)
			}
		})
	}, [])

	return (
		<>
			<div
				style={{
					height: '100%',
					width: '40rem',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<Card
					bodyStyle={{ padding: 0, overflow: 'hidden' }}
					style={{
						padding: 0,
						width: '100%'
					}}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							paddingLeft: '6rem',
							paddingRight: '6rem',
							paddingTop: '4rem'
						}}>
						<Form
							form={form}
							labelCol={{
								span: 8
							}}
							wrapperCol={{
								span: 16
							}}
							style={{
								width: '100%'
							}}
							onFinish={handleSubmit}
							autoComplete="off"
							colon={false}>
							<Form.Item
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										type: 'email',
										message: 'Please input your email!'
									}
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!'
									}
								]}>
								<Input.Password />
							</Form.Item>
							<Form.Item
								name="remember_me"
								valuePropName="checked"
								wrapperCol={{
									offset: 8
								}}>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
							<Form.Item
								wrapperCol={{
									offset: 8,
									span: 16
								}}>
								<Row justify="space-between">
									<Col>
										<Button type="primary" htmlType="submit" loading={isLoading}>
											Login
										</Button>
									</Col>
									<Col>
										<Link href="/forgot-password">Forgot password</Link>
									</Col>
								</Row>
							</Form.Item>
						</Form>
					</div>
				</Card>
			</div>
		</>
	)
}

export default LoginPage
export const getServerSideProps = withSession(async function ({ req }) {
	const access_token = req.session?.auth?.access_token
	const isLoggedOut = !access_token
	const validator = [isLoggedOut]

	return routeGuard(validator, '/', {
		props: {}
	})
})
