import { Button, Col, Popconfirm, Row, Space } from 'antd'
import axios from 'axios'
import useMediaQuery from 'use-media-antd-query'
import { useRouter } from 'next/router'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import MainTabs from '@/components/Tabs'
import MainTable from '@/components/Table'
import { withSession } from '@/utils/session-wrapper'
import axiosGroup from '@/utils/axiosGroup'
import routeGuard from '@/utils/route-guard'
import { getTouristObjectMe } from '@/services/tourist-object'
import idrFormatter from '@/utils/idrFormatter'
const responsiveTabPosition = {
	xs: 'top',
	sm: 'top',
	md: 'top'
}
const tab_items = [
	{ label: 'Profile', key: '/profile' },
	{ label: 'Wisata Saya', key: '/wisata-saya' }
]
const WisataSaya = ({ query, touristObjectMeData }) => {
	const router = useRouter()
	const colSize = useMediaQuery()
	const handleDeleteTouristObject = async (slug) => {
		return await axios.request({
			method: 'delete',
			url: '/api/tourist-object/' + slug
		}).then(()=>{
			router.reload()
		})
	}
	const columns = [
		{ title: 'No', render: (value, row, index) => (query.page - 1) * query.per_page + index + 1 },
		{
			key: 'name',
			dataIndex: 'name',
			title: 'Nama'
		},
		{ key: 'price', dataIndex: 'price', title: 'Harga', render: (value) => idrFormatter(parseInt(value)) },
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
			render: (value, row, index) => (
				<Space>
					<Button
						type="text"
						icon={<ExclamationCircleOutlined />}
						onClick={() => {
							router.push('/detail/' + row.slug)
						}}
					/>
					<Button
						type="text"
						icon={<EditOutlined />}
						onClick={() => {
							router.push('/wisata-saya/edit/' + row.slug)
						}}
					/>
					<Popconfirm
						placement="bottom"
						title="konfirmasi delete"
						description="yakin ingin menghapus data ini?"
						onConfirm={async () => await handleDeleteTouristObject(row.slug)}
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
					<MainTabs tabPosition={responsiveTabPosition[colSize] ?? 'left'} items={tab_items} />
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
	return routeGuard(validator, '/login', {
		props: { errors, query: queryMerge, touristObjectMeData }
	})
})
