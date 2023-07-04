import { Col, Row } from 'antd'
import MainTabs from '@/components/Tabs'
const tab_items = [
	{ label: 'Profile', key: '/profile' },
	{ label: 'Wisata Saya', key: '/wisata-saya' }
]
const WisataSaya = () => {
	return (
		<div>
			<Row>
				<Col span={4}>
					<MainTabs tabPosition="left" items={tab_items} />
				</Col>
			</Row>
		</div>
	)
}
export default WisataSaya
