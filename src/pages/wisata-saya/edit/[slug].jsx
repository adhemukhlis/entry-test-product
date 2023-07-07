import { Typography, theme, Row, Col, Button, Result, Form, Input, InputNumber, Select, message } from 'antd'

import { useRouter } from 'next/router'

import useMediaQuery from 'use-media-antd-query'
import axios from 'axios'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { LeftOutlined } from '@ant-design/icons'
import { withSession } from '@/utils/session-wrapper'
import axiosGroup from '@/utils/axiosGroup'
import { getTouristObjectCategory, getTouristObjectSlug } from '@/services/tourist-object'
import Map from '@/components/Map'
import routeGuard from '@/utils/route-guard'
import MainTabs from '@/components/Tabs'
import UploadProfile from '@/components/UploadImageProfile'
const ReactQuill = dynamic(() => import('@/components/quill'), { ssr: false })
const { Title } = Typography
const { useToken } = theme
const responsiveTabPosition = {
	xs: 'top',
	sm: 'top',
	md: 'top'
}
const tab_items = [
	{ label: 'Profile', key: '/profile' },
	{ label: 'Wisata Saya', key: '/wisata-saya/edit/[slug]' }
]
const EditWisataSaya = ({ query, isNotFound, touristObjectDetail, touristObjectListCategory }) => {
	const router = useRouter()
	const colSize = useMediaQuery()
	const [messageApi, contextHolder] = message.useMessage()
	const [form] = Form.useForm()
	const uploadImage = Form.useWatch('image', form)
	const { token } = useToken()
	const [loading, setLoading] = useState(false)
	const [long, lat] = touristObjectDetail?.location?.coordinates || [0, 0]
	const DEFAULT_CENTER = [lat, long]

	const handleSubmit = async (values) => {
		setLoading(true)
		const body = {
			...values,
			price: String(values.string)
		}

		return axios
			.request({
				method: 'patch',
				url: '/api/tourist-object/' + query.slug,
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
	const handleUpload = async (file) => form.setFieldValue('image', file)

	return !isNotFound ? (
		<>
			<Row justify="center">
				<Col {...{ xs: 24, sm: 24, md: 24, lg: 4, xl: 4 }}>
					<MainTabs tabPosition={responsiveTabPosition[colSize] ?? 'left'} items={tab_items} />
				</Col>
				<Col {...{ xs: 24, sm: 24, md: 24, lg: 20, xl: 20 }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column'
						}}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div style={{ display: 'flex', flex: 1 }}>
								<Button size="large" shape="circle" icon={<LeftOutlined />} onClick={() => router.back()} />
							</div>
							<div style={{ display: 'flex', flex: 10, flexDirection: 'column' }}>
								<Title>EDIT : {touristObjectDetail.name}</Title>
								<div style={{ border: `solid 2px ${token.colorPrimary}`, width: '8rem', marginBottom: '1rem' }} />
							</div>
							<div style={{ display: 'flex', flex: 1 }}></div>
						</div>
						<Form
							form={form}
							initialValues={{ ...touristObjectDetail, price: parseInt(touristObjectDetail.price) }}
							layout="vertical"
							wrapperCol={{
								span: 16
							}}
							style={{
								width: '100%'
							}}
							onFinish={handleSubmit}
							autoComplete="off"
							colon={false}>
							<Form.Item label="Image" name="image">
								<UploadProfile onReadyUpload={handleUpload} imageUrl={uploadImage ?? ''} />
							</Form.Item>
							<Form.Item
								label="Nama"
								name="name"
								rules={[
									{
										required: true,
										message: 'Please input Name!'
									}
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Harga"
								name="price"
								rules={[
									{
										required: true,
										type: 'number',
										message: 'Please input Harga!'
									}
								]}>
								<InputNumber style={{ width: '100%' }} />
							</Form.Item>
							<Form.Item
								label="Kategori"
								name="category"
								rules={[
									{
										required: true,
										message: 'Please input Harga!'
									}
								]}>
								<Select options={touristObjectListCategory} />
							</Form.Item>
							<Form.Item
								label="Deskripsi"
								name="description"
								rules={[
									{
										required: true,
										message: 'Please input Deskripsi!'
									}
								]}>
								<ReactQuill />
							</Form.Item>
							<Form.Item
								label="Alamat"
								name="address"
								rules={[
									{
										required: true,
										message: 'Please input Address!'
									}
								]}>
								<Input.TextArea />
							</Form.Item>
							<Form.Item>
								<Row justify="end">
									<Col>
										<Button type="primary" htmlType="submit" loading={loading}>
											Simpan
										</Button>
									</Col>
								</Row>
							</Form.Item>
						</Form>

						<div style={{ width: '100%', marginTop: '2rem' }}>
							<Map width="800" height="400" center={DEFAULT_CENTER} zoom={14}>
								{({ TileLayer, Marker, Popup }) => (
									<>
										<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
										<Marker position={DEFAULT_CENTER}>
											<Popup>{touristObjectDetail.name}</Popup>
										</Marker>
									</>
								)}
							</Map>
						</div>
					</div>
				</Col>
			</Row>
			{contextHolder}
		</>
	) : (
		<>
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button onClick={() => router.back()}>Back</Button>}
			/>
		</>
	)
}
export default EditWisataSaya
export const getServerSideProps = withSession(async ({ req, query }) => {
	const access_token = req.session?.auth?.access
	const isLoggedIn = !!access_token
	const validator = [isLoggedIn]
	const hasSlug = !!query?.slug
	let isNotFound = false
	const errors = []
	let touristObjectDetail = {}
	let touristObjectListCategory = []
	if (![hasSlug].includes(false)) {
		const [responseTouristObjectSlug] = await axiosGroup([getTouristObjectSlug(query.slug)])
		if (responseTouristObjectSlug.status === 200) {
			const { data } = responseTouristObjectSlug.response
			touristObjectDetail = data || {}
		} else if (responseTouristObjectSlug.status === 404) {
			console.log('responseTouristObjectSlug', responseTouristObjectSlug.error)
			isNotFound = true
			errors.push({
				url: responseTouristObjectSlug.url,
				message: responseTouristObjectSlug.error.response.data.detail
			})
		} else {
			errors.push({
				url: responseTouristObjectSlug.url,
				message: responseTouristObjectSlug.error.response.data.detail
			})
		}
	}
	const [responseTouristObjectCategory] = await axiosGroup([getTouristObjectCategory()])
	if (responseTouristObjectCategory.status === 200) {
		const { data } = responseTouristObjectCategory.response.data
		touristObjectListCategory = (data || []).map((item) => ({ value: item.slug, label: item.label }))
	} else {
		errors.push({
			url: responseTouristObjectCategory.url,
			message: responseTouristObjectCategory.error.response.data.message
		})
	}

	return routeGuard(validator, '/login', {
		props: {
			query,
			errors,
			isNotFound,
			touristObjectListCategory,
			touristObjectDetail
		}
	})
})
