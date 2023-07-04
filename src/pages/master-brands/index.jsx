// #NEED_FIX
// 1. query props to table
import { Button, Image, Table, Tag, Typography } from 'antd'
import Link from 'next/link'
import { getListBrand } from '../api/master-brand'
import { withSession } from '@/utils/session-wrapper'
import globalStore from '@/utils/global-store'
import validatePermission from '@/utils/validate-permission'
import axiosGroup from '@/utils/axiosGroup'
import routeGuard from '@/utils/route-guard'
import ErrorPanel from '@/components/ErrorPanel'
const { Title } = Typography
const STATUS_COLORS = ['red', 'green']
const STATUS_TEXT = ['Inactive', 'Active']
const MasterBrand = ({ brandList, errors }) => {
	const columns = [
		{
			key: 'name',
			dataIndex: 'name',
			title: 'Nama Brand',
			render: (text, rowValues) => <Link href={'/master-brands/detail/' + rowValues.id}>{text}</Link>
		},
		{
			key: 'image',
			dataIndex: 'image',
			title: 'Logo Brand',
			render: (imageUrl) => <Image width={200} height={200} src={imageUrl} alt="brand-logo" />
		},
		{
			key: 'status',
			dataIndex: 'status',
			title: 'Status',
			render: (value) => (
				<Tag bordered={false} color={STATUS_COLORS[value]}>
					{STATUS_TEXT[value]}
				</Tag>
			)
		}
	]

	return (
		<>
			<ErrorPanel errors={errors} />
			<Title level={3}>Master Brands</Title>
			<div
				style={{
					marginBottom: '1rem'
				}}>
				<Link href="/master-brands/add">
					<Button type="primary" size="middle">
						Add
					</Button>
				</Link>
			</div>
			<Table rowKey="id" dataSource={brandList} columns={columns} />
		</>
	)
}

export default MasterBrand

export const getServerSideProps = withSession(async ({ req, query }) => {
	const access_token = req.session?.auth?.access_token
	const isLoggedIn = !!access_token
	const authMenu = globalStore.get('authMenu')
	const hasReadAccess = validatePermission(authMenu || [], 'master_brands', 'read')
	let brandList = []
	let queryMerge = { ...query }
	const errors = []
	const validator = [isLoggedIn]
	if (![isLoggedIn, hasReadAccess].includes(false)) {
		const [responseListBrand] = await axiosGroup([getListBrand()])

		if (responseListBrand.status === 200) {
			const { page, per_page, data } = responseListBrand.response.data
			brandList = data || []
			queryMerge = { ...query, page, per_page }
		} else {
			errors.push({ url: responseListBrand.url, message: responseListBrand.error.response.data.message })
		}
	}

	return routeGuard(validator, '/', {
		props: {
			query: queryMerge,
			errors,
			hasReadAccess,
			brandList
		}
	})
})
