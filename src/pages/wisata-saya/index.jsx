import { Button, Col, Popconfirm, Row, Space } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import MainTabs from '@/components/Tabs'
import MainTable from '@/components/Table'
import { withSession } from '@/utils/session-wrapper'
import axiosGroup from '@/utils/axiosGroup'
import routeGuard from '@/utils/route-guard'
import { getTouristObjectMe } from '@/services/tourist-object'
const tab_items = [
	{ label: 'Profile', key: '/profile' },
	{ label: 'Wisata Saya', key: '/wisata-saya' }
]
const WisataSaya = ({ query, touristObjectMeData }) => {
	const columns = [
		{ title: 'No', render: (value, row, index) => (query.page - 1) * query.per_page + index + 1 },
		{
			key: 'name',
			dataIndex: 'name',
			title: 'Nama'
		},
		{ key: 'price', dataIndex: 'price', title: 'Harga' },
		{
			key: 'category',
			dataIndex: 'category',
			title: 'Kategori'
		},
		{
			key: 'action',
			width: 160,
			dataIndex: 'action',
			title: 'Action',
			render: () => (
				<Space>
					<Button type="text" icon={<ExclamationCircleOutlined />} />
					<Button type="text" icon={<EditOutlined />} />
					<Popconfirm
						placement="bottom"
						title="konfirmasi delete"
						description="yakin ingin menghapus data ini?"
						onConfirm={() => {}}
						okText="Yes"
						cancelText="No">
						<Button type="text" icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			)
		}
	]
	return (
		<div>
			<Row>
				<Col {...{ xs: 24, sm: 24, md: 24, lg: 4 }}>
					<MainTabs tabPosition="left" items={tab_items} />
				</Col>
				<Col {...{ xs: 24, sm: 24, md: 24, lg: 20 }}>
					<MainTable rowKey="id" dataSource={touristObjectMeData} columns={columns} query={query} />
				</Col>
			</Row>
		</div>
	)
}
export default WisataSaya

export const getServerSideProps = withSession(async ({ req, query }) => {
	const access_token = req.session?.auth?.access
	const isLoggedIn = !!access_token
	const errors = []
	const validator = [isLoggedIn]

	const { total, per_page, ...other } = query
	let queryMerge = { ...other, per_page: 10 }

	let touristObjectMeData = []
	if (![isLoggedIn].includes(false)) {
		const [responseTouristObjectMe] = await axiosGroup([getTouristObjectMe(access_token, queryMerge)])
		if (responseTouristObjectMe.status === 200) {
			const { data } = responseTouristObjectMe.response.data
			const { page, per_page, total } = responseTouristObjectMe.response.data.meta
			touristObjectMeData = data || {}
			queryMerge = { ...query, page, per_page, total }
		} else {
			errors.push({
				url: responseTouristObjectMe.url,
				message: responseTouristObjectMe.error.response.data.message
			})
		}
	}
	return routeGuard(validator, '/', {
		props: { errors, query: queryMerge, touristObjectMeData }
	})
})
