// #NEED_FIX
// 1. need button delete with popconfirm
import { Button, Form, Input, Result, Row, Space, Switch, Typography } from 'antd'
const { Title } = Typography
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { deleteBrand, editBrand, getBrandDetail } from '@/pages/api/master-brand'
import UploadImage from '@/components/UploadImage'
import { withSession } from '@/utils/session-wrapper'
import globalStore from '@/utils/global-store'
import validatePermission from '@/utils/validate-permission'
import axiosGroup from '@/utils/axiosGroup'
import routeGuard from '@/utils/route-guard'
import ErrorPanel from '@/components/ErrorPanel'

const DetailBrand = ({ brandData, errors, isNotFound, hasReadAccess, hasUpdateAccess, hasDeleteAccess }) => {
	const router = useRouter()

	const { id } = router.query

	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const { status, ...other } = brandData

	const initialValues = {
		...other,
		status: !!status,
		code: ''
	}

	const uploadImage = Form.useWatch('image', form)
	const handleUpload = (file) => {
		if (file !== undefined) {
			var bodyFormData = new FormData()
			bodyFormData.append('file', file)
			axios
				.request({
					data: bodyFormData,
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					method: 'POST',
					url: '/api/upload'
				})
				.then((response) => {
					form.setFieldValue('image', response.data.uploadResponse.Location)
				})
		}
	}

	const submitHandler = (values) => {
		setLoading(true)
		const toBeSubmitted = {
			...values,
			status: values.status ? 1 : 0
		}

		editBrand(id, toBeSubmitted)
			.then(router.push('/master-brands'))
			.catch((error) => {
				throw error
			})
			.finally(setLoading(false))
	}

	return !isNotFound && hasReadAccess ? (
		<>
			<ErrorPanel errors={errors} />
			<Title level={3}>Detail Master Brands</Title>
			<Form
				form={form}
				initialValues={initialValues}
				autoComplete="off"
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 12 }}
				labelAlign="left"
				colon={false}
				onFinish={submitHandler}>
				<div
					style={{
						padding: 8,
						marginTop: 4,
						backgroundColor: 'white',
						marginBottom: 16
					}}>
					<Form.Item name="name" label="Nama Brand" rules={[{ required: true, message: 'This field is required' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="image" label="Logo Brand" rules={[{ required: true, message: 'Logo Brand is required' }]}>
						<UploadImage maxSize={5} onReadyUpload={handleUpload} imageUrl={uploadImage} />
					</Form.Item>
					<Form.Item
						valuePropName="checked"
						name="status"
						label="Status"
						rules={[{ required: true, message: 'This field is required' }]}>
						<Switch />
					</Form.Item>

					<Row justify="end">
						<Form.Item wrapperCol={{ span: 24 }}>
							<Space>
								<Button danger htmlType="button" onClick={() => router.replace('/master-brands')} disabled={loading}>
									Cancel
								</Button>
								{hasDeleteAccess && (
									<Button
										danger
										type="primary"
										htmlType="button"
										onClick={() => {
											deleteBrand(id)
										}}
										disabled={loading}>
										Delete
									</Button>
								)}
								{hasUpdateAccess && (
									<Button type="primary" htmlType="submit" loading={loading}>
										Update
									</Button>
								)}
							</Space>
						</Form.Item>
					</Row>
				</div>
			</Form>
		</>
	) : hasReadAccess ? (
		<>
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button onClick={() => window.history.back()}>Back</Button>}
			/>
		</>
	) : (
		<>
			<Result
				status="403"
				title="403"
				subTitle="Sorry, you are not authorized to access this page."
				extra={<Button onClick={() => window.history.back()}>Back</Button>}
			/>
		</>
	)
}

export default DetailBrand

export const getServerSideProps = withSession(async ({ req, query }) => {
	const access_token = req.session?.auth?.access_token
	const isLoggedIn = !!access_token
	const authMenu = globalStore.get('authMenu')
	const hasReadAccess = validatePermission(authMenu || [], 'master_brands', 'read')
	const hasUpdateAccess = validatePermission(authMenu || [], 'master_brands', 'update')
	const hasDeleteAccess = validatePermission(authMenu || [], 'master_brands', 'delete')
	const validator = [isLoggedIn]
	let brandData = []
	let isNotFound = false
	const errors = []
	if (![isLoggedIn, hasReadAccess].includes(false)) {
		const [respBrandDetail] = await axiosGroup([getBrandDetail(query.id)])
		if (respBrandDetail.status === 200) {
			const { data } = respBrandDetail.response.data
			brandData = data || {}
		} else if ([400].includes(respBrandDetail.status)) {
			isNotFound = true
		} else {
			errors.push({
				url: respBrandDetail.url,
				message: respBrandDetail.error.response.data.message
			})
		}
	}
	return routeGuard(validator, '/', {
		props: { brandData, isNotFound, errors, hasReadAccess, hasUpdateAccess, hasDeleteAccess }
	})
})
