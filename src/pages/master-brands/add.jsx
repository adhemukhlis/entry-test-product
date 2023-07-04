import { Button, Form, Input, Result, Row, Space, Switch, Typography } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { createBrand } from '../api/master-brand'
import UploadImage from '@/components/UploadImage'
import { withSession } from '@/utils/session-wrapper'
import globalStore from '@/utils/global-store'
import validatePermission from '@/utils/validate-permission'
import routeGuard from '@/utils/route-guard'
const { Title } = Typography

const AddBrands = ({ hasCreateAccess }) => {
	const router = useRouter()

	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

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

	const submitHandler = async (values) => {
		setLoading(true)

		const toBeSubmitted = {
			...values,
			// image: respImageUpload.data.uploadResponse.Location,
			status: values.status ? 1 : 0
		}
		createBrand(toBeSubmitted)
			.then((res) => {
				router.push('/master-brands')
			})
			.catch((error) => {
				throw error
			})
			.finally(() => {
				setLoading(false)
			})
	}
	return hasCreateAccess ? (
		<>
			<Title level={3}>Add New Brands</Title>
			<Form
				form={form}
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
						initialValue={true}
						valuePropName="checked"
						name="status"
						label="Status"
						rules={[{ required: true, message: 'This field is required' }]}>
						<Switch defaultChecked />
					</Form.Item>

					<Row justify="end" className="pt-5 pr-10 fixed bottom-0 right-0 backdrop-blur bg-white/50 w-full">
						<Form.Item wrapperCol={{ span: 24 }}>
							<Space>
								<Button htmlType="button" onClick={() => router.replace('/master-brands')} disabled={loading}>
									Cancel
								</Button>
								<Button type="primary" htmlType="submit" loading={loading}>
									Submit
								</Button>
							</Space>
						</Form.Item>
					</Row>
				</div>
			</Form>
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

export default AddBrands

export const getServerSideProps = withSession(async ({ req, query }) => {
	const access_token = req.session?.auth?.access_token
	const isLoggedIn = !!access_token
	const authMenu = globalStore.get('authMenu')
	const hasCreateAccess = validatePermission(authMenu || [], 'master_brands', 'create')
	const validator = [isLoggedIn]

	return routeGuard(validator, '/', {
		props: { hasCreateAccess }
	})
})
