import { Button, Col, Form, Input, InputNumber, Row, Typography, message } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import useMediaQuery from 'use-media-antd-query'
import MainTabs from '@/components/Tabs'
import UploadProfile from '@/components/UploadImageProfile'
import routeGuard from '@/utils/route-guard'
import axiosGroup from '@/utils/axiosGroup'
import { getProfile } from '@/services/profile'
import { withSession } from '@/utils/session-wrapper'
const tab_items = [
	{ label: 'Profile', key: '/profile' },
	{ label: 'Wisata Saya', key: '/wisata-saya' }
]
const responsiveTabPosition = {
	xs: 'top',
	sm: 'top',
	md: 'top'
}
const { Title, Text } = Typography
const Profile = ({ profileData }) => {
	const [messageApi, contextHolder] = message.useMessage()
	const colSize = useMediaQuery()
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const [profileDataLocal, setProfileDataLocal] = useState(profileData)
	const handleUpload = async (file) => setProfileDataLocal((prev) => ({ ...prev, photo: file }))
	const handleSaveProfile = async (values) => {
		setLoading(true)
		const body = {
			...values,
			role: profileData.role,
			username: profileData.username,
			...(typeof profileDataLocal?.photo === 'string'
				? {}
				: profileDataLocal?.photo !== null && profileDataLocal?.photo !== undefined
				? { photo: profileDataLocal.photo }
				: {})
		}

		return axios
			.request({
				method: 'patch',
				url: '/api/profile',
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				data: body
			})
			.then(() => {
				messageApi.success('Data berhasl disimpan!')
			})
			.finally(() => {
				setLoading(false)
			})
	}
	return (
		<div>
			{contextHolder}
			<Row>
				<Col {...{ xs: 24, sm: 24, md: 24, lg: 4 }}>
					<MainTabs tabPosition={responsiveTabPosition[colSize] ?? 'left'} items={tab_items} />
				</Col>
				<Col {...{ xs: 24, sm: 24, md: 24, lg: 20 }}>
					<Row gutter={[24, 24]}>
						<Col {...{ xs: 24, sm: 24, md: 4, lg: 4 }}>
							<UploadProfile onReadyUpload={handleUpload} imageUrl={profileDataLocal?.photo ?? ''} />
						</Col>
						<Col {...{ xs: 24, sm: 24, md: 16, lg: 16 }}>
							<Title level={5}>{profileDataLocal.full_name}</Title>{' '}
							<Text type="secondary">{profileDataLocal?.address ?? '*address not set'}</Text>
						</Col>
						<Col {...{ xs: 24, sm: 24, md: 4, lg: 4 }}>
							<Button type="primary" size="large" shape="round" block onClick={() => form.submit()} loading={loading}>
								Simpan
							</Button>
						</Col>
					</Row>
					<Row style={{ marginTop: '4rem' }}>
						<Col span={24}>
							<Form
								form={form}
								autoComplete="off"
								wrapperCol={{ span: 12 }}
								layout="vertical"
								colon={false}
								onFinish={handleSaveProfile}
								initialValues={profileDataLocal}>
								<Form.Item name="full_name" label="Nama" rules={[{ required: true, message: 'This field is required' }]}>
									<Input />
								</Form.Item>
								<Form.Item
									name="email"
									label="Email"
									rules={[{ required: true, message: 'This field is required', type: 'email' }]}>
									<Input />
								</Form.Item>
								<Form.Item name="address" label="Alamat" rules={[{ message: 'This field is required' }]}>
									<Input.TextArea />
								</Form.Item>
								<Form.Item
									name="handphone"
									label="No Handphone"
									rules={[{ message: 'This field is required', type: 'number' }]}>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Form>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	)
}
export default Profile
export const getServerSideProps = withSession(async ({ req }) => {
	const access_token = req.session?.auth?.access
	const isLoggedIn = !!access_token
	const errors = []
	const validator = [isLoggedIn]

	let profileData = {}
	if (![isLoggedIn].includes(false)) {
		const [responseProfile] = await axiosGroup([getProfile(access_token)])
		if (responseProfile.status === 200) {
			const { data } = responseProfile.response.data
			profileData = data || {}
		} else {
			errors.push({
				url: responseProfile.url,
				message: responseProfile.error.response.data.message
			})
		}
	}
	return routeGuard(validator, '/login', {
		props: { errors, profileData }
	})
})
