import { Typography, Input, theme, Form, Row, Col, Card, Tag, Pagination, Select } from 'antd'
import { useEffect } from 'react'
import Image from 'next/image'
import { isBoolean, isEmpty, isNumber, omit, pickBy } from 'lodash'
import { useRouter } from 'next/router'
import { upper } from 'case'
import { withSession } from '@/utils/session-wrapper'
import { getProfile } from '@/services/profile'
import axiosGroup from '@/utils/axiosGroup'
import { useNavbarContext } from '@/context/navbar'
import { getTouristObject, getTouristObjectCategory } from '@/services/tourist-object'
import idrFormatter from '@/utils/idrFormatter'
const { Title, Text } = Typography
const { useToken } = theme

const Index = ({ query, profileData, isLoggedIn, touristObjectList, touristObjectListCategory }) => {
	const router = useRouter()
	const [form] = Form.useForm()
	const { token } = useToken()
	const { setUserData } = useNavbarContext()
	useEffect(() => {
		setUserData({ ...profileData, isLoggedIn })
	}, [])
	const handleFilter = () => {
		const values = form.getFieldsValue()
		const other = omit(query, ['total', 'per_page'])
		const params = pickBy({ ...other, ...values }, (v) => isNumber(v) || isBoolean(v) || !isEmpty(v))
		router.push({
			pathname: '/',
			query: params
		})
	}
	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					flexDirection: 'column'
				}}>
				<Title>Wisata</Title>
				<div style={{ border: `solid 2px ${token.colorPrimary}`, width: '10rem', marginBottom: '1rem' }} />
				<Text style={{ marginBottom: '1rem' }}>Temukan wisata menarik disini</Text>
				<Form form={form} layout="inline" initialValues={query} autoComplete="off">
					<Form.Item name="search" style={{ width: '10rem' }}>
						<Input.Search placeholder="Cari" onSearch={handleFilter} allowClear />
					</Form.Item>
					<Form.Item name="category" style={{ width: '10rem' }}>
						<Select options={touristObjectListCategory} placeholder="Pilih Kategori" onChange={handleFilter} allowClear />
					</Form.Item>
				</Form>
				<Row gutter={[24, 24]} style={{ marginTop: '2rem', width: '100%' }}>
					{touristObjectList.map((item, index) => (
						<Col key={`card-${index}`} {...{ xs: 24, sm: 24, md: 8, lg: 8, xl: 8 }}>
							<Card style={{ width: '100%' }} hoverable>
								<div
									style={{
										width: '100%',
										height: '100%',
										display: 'flex',
										alignItems: 'center'
									}}>
									<Image
										src={item.image}
										width="0"
										height="0"
										sizes="200px"
										style={{ width: '100%', height: 'auto', borderRadius: '0.4rem' }}
										alt="logo"
									/>
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', marginBottom: '1rem' }}>
									<Tag bordered={false} color="orange" style={{ borderRadius: '10px' }}>
										{upper(item.category)}
									</Tag>
									<Text strong>{idrFormatter(parseInt(item.price))}</Text>
								</div>
								<Title level={5}>{item.name}</Title>
								<div className="text-ellipsis-2" dangerouslySetInnerHTML={{ __html: item.description }} />
							</Card>
						</Col>
					))}
				</Row>
				<Pagination
					defaultCurrent={query?.page || 1}
					total={query.total}
					pageSize={query?.per_page || 10}
					style={{ marginTop: '2rem' }}
					onChange={(value) => {
						router.push({
							pathname: '/',
							query: {
								...query,
								page: value
							}
						})
					}}
				/>
			</div>
		</>
	)
}
export default Index
export const getServerSideProps = withSession(async ({ req, query }) => {
	const access_token = req.session?.auth?.access
	const isLoggedIn = !!access_token
	const errors = []
	const { total, per_page, ...other } = query
	let queryMerge = { ...other, per_page: 10 }
	let profileData = {}
	let touristObjectList = []
	let touristObjectListCategory = []
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
	const [responseTouristObject, responseTouristObjectCategory] = await axiosGroup([
		getTouristObject(queryMerge),
		getTouristObjectCategory()
	])
	if (responseTouristObject.status === 200) {
		const { data } = responseTouristObject.response.data
		const { page, per_page, total } = responseTouristObject.response.data.meta
		touristObjectList = data || []
		queryMerge = { ...query, page, per_page, total }
	} else {
		errors.push({
			url: responseTouristObject.url,
			message: responseTouristObject.error.response.data.message
		})
	}
	if (responseTouristObjectCategory.status === 200) {
		const { data } = responseTouristObjectCategory.response.data
		touristObjectListCategory = (data || []).map((item) => ({ value: item.slug, label: item.label }))
	} else {
		errors.push({
			url: responseTouristObjectCategory.url,
			message: responseTouristObjectCategory.error.response.data.message
		})
	}
	return {
		props: {
			errors,
			isLoggedIn,
			query: queryMerge,
			profileData,
			touristObjectList,
			touristObjectListCategory
		}
	}
})
