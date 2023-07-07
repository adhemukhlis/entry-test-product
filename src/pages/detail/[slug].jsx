import { Typography, theme, Row, Col, Card, Tag, Avatar, Button, Result } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { upper } from 'case'
import dayjs from 'dayjs'
import { LeftOutlined } from '@ant-design/icons'
import { withSession } from '@/utils/session-wrapper'
import axiosGroup from '@/utils/axiosGroup'
import { getTouristObjectSlug } from '@/services/tourist-object'
import idrFormatter from '@/utils/idrFormatter'
import Map from '@/components/Map'
import ShareButton from '@/components/ShareButton'
require('dayjs/locale/id')
const { Title, Text, Paragraph } = Typography
const { useToken } = theme

const Index = ({ isNotFound, touristObjectDetail }) => {
	const router = useRouter()
	const { token } = useToken()
	const [long, lat] = touristObjectDetail?.location?.coordinates || [0, 0]
	const DEFAULT_CENTER = [lat, long]
	return !isNotFound ? (
		<>
			<Row justify="center">
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
							<div style={{ display: 'flex', flex: 10, flexDirection: 'column', alignItems: 'center' }}>
								<Title>{touristObjectDetail.name}</Title>
								<div style={{ border: `solid 2px ${token.colorPrimary}`, width: '10rem', marginBottom: '1rem' }} />
							</div>
							<div style={{ display: 'flex', flex: 1 }}></div>
						</div>
						<div
							style={{
								marginTop: '4rem',
								width: '100%',
								height: '100%',
								display: 'flex',
								alignItems: 'center'
							}}>
							<Image
								src={touristObjectDetail.image}
								width="0"
								height="0"
								sizes="200px"
								style={{ width: '100%', height: 'auto', borderRadius: '0.4rem' }}
								alt="logo"
							/>
						</div>
						<div style={{ display: 'flex', marginTop: '2rem', width: '100%', gap: '1rem' }}>
							<Avatar size="large" src={''} />
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', gap: '1rem' }}>
									<Title level={5}>User</Title>
									<div>
										<Tag bordered={false} color="orange" style={{ borderRadius: '10px' }}>
											{upper('konvensi')}
										</Tag>
									</div>
								</div>
								<Text type="secondary">
									Diposting pada {dayjs(touristObjectDetail.created).locale('id').format('DD MMMM YYYY')}
								</Text>
							</div>
						</div>
						<div style={{ display: 'flex', marginTop: '2rem', width: '100%', gap: '1rem' }}>
							<Paragraph>
								<div dangerouslySetInnerHTML={{ __html: touristObjectDetail.description }} />
							</Paragraph>
						</div>
						<Row justify="space-around" gutter={[24, 24]} style={{ width: '100%' }}>
							<Col {...{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }}>
								<Card style={{ width: '100%' }}>
									<div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
										<Image src="/assets/images/image-wallet.png" width={60} height={60} />
										<div style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
											<Text>Harga</Text>
											<Text strong>{idrFormatter(parseInt(touristObjectDetail.price))}</Text>
										</div>
									</div>
								</Card>
							</Col>
							<Col {...{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }}>
								<Card style={{ width: '100%' }}>
									<div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
										<Image src="/assets/images/image-phone.png" width={60} height={60} />
										<div style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
											<Text>No. Telpon</Text>
											<Text strong>0821-4245-5563</Text>
										</div>
									</div>
								</Card>
							</Col>
						</Row>
						<div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}>

							<Text strong>Share Wisata ini</Text>
							<ShareButton />
						</div>
						<div style={{ width: '100%', marginTop: '2rem' }}>
							<Map width="800" height="400" center={DEFAULT_CENTER} zoom={14}>
								{({ TileLayer, Marker, Popup }) => (
									<>
										<TileLayer
											url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											// attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
										/>
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
export default Index
export const getServerSideProps = withSession(async ({ query }) => {
	const hasSlug = !!query?.slug
	let isNotFound = false
	const errors = []
	let touristObjectDetail = {}
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

	return {
		props: {
			errors,
			isNotFound,
			touristObjectDetail
		}
	}
})
