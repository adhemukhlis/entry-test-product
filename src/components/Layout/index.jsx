'use client'
import { Avatar, Button, Col, Dropdown, Layout, Row, Space, message, theme } from 'antd'
import { useRouter } from 'next/router'
import { DownOutlined } from '@ant-design/icons'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import { useNavbarContext } from '@/context/navbar'

const { Content, Header, Footer } = Layout
const LayoutComponent = ({ children }) => {
	const { userData, resetUserData } = useNavbarContext()
	const router = useRouter()
	const {
		token: { colorBgContainer }
	} = theme.useToken()
	const items = [
		{
			key: '1',
			label: 'Profile',
			onClick: () => router.push('/profile')
		},
		{
			key: '2',
			label: 'Ubah Password',
			onClick: () => router.push('/wisata-saya')
		},
		{
			key: '3',
			label: 'Keluar',
			onClick: async () =>
				await axios.request({ method: 'post', url: '/api/auth/logout' }).then((res) => {
					message.info(res.data)
					resetUserData()
					router.push('/login')
				})
		}
	]

	// const currentPath = router.pathname

	// const handleSelectMenu = (menu) => {
	// 	if (menu.key === '/logout') {
	// 		axios.request({ method: 'post', url: '/api/auth/logout' }).then((res) => {
	// 			message.info(res.data)
	// 			asyncLocalStorage.setItem('_am', '').then(() => {
	// 				setTimeout(() => {
	// 					router.push('/login')
	// 				}, 1200)
	// 			})
	// 		})
	// 	} else {
	// 		router.push(menu.key)
	// 	}
	// }

	return (
		<Layout
			style={{
				minHeight: '100vh'
			}}>
			{/* <Sider
				collapsible
				width={250}
				style={{
					backgroundColor: colorBgContainer
				}}
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}>
				<Menu theme="light" defaultSelectedKeys={[currentPath]} mode="inline" items={menus} onSelect={handleSelectMenu} />
			</Sider> */}

			<Layout>
				<Header
					style={{
						padding: 0,
						background: colorBgContainer
					}}>
					<Row justify="center">
						<Col span={22}>
							<Row gutter={[24, 24]}>
								<Col span={4}>
									<Link href="/">
										<div
											style={{
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center'
											}}>
											<Image
												src="/logo.png"
												width="0"
												height="0"
												sizes="200px"
												style={{ width: '65%', height: 'auto' }}
												alt="logo"
											/>
										</div>
									</Link>
								</Col>
								<Col span={20}>
									<Row justify="end">
										<Col>
											{userData.isLoggedIn ? (
												<Space>
													<Avatar size="large" src={userData.photo} />
													<Dropdown menu={{ items }} placement="bottomRight" arrow trigger={['click']}>
														<Button type="text">
															{userData.username}
															<DownOutlined />
														</Button>
													</Dropdown>
												</Space>
											) : (
												<Button type="primary" shape="round" size="large" href="/login">
													Login
												</Button>
											)}
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>

					{/* <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          /> */}
				</Header>
				<Content
					style={{
						margin: '1rem',
						minHeight: 'calc(100vh-2rem)' // minHeight = heigh of screen - (margin top + margin bottom)
					}}>
					<div
						style={{
							padding: 24,
							height: '100%',
							background: colorBgContainer
						}}>
						{children}
					</div>
				</Content>
				<Footer style={{ textAlign: 'center', backgroundColor: '#2B2C2B', height: '8rem' }}>
					<div
						style={{
							width: '10%',
							height: '100%',
							display: 'flex',
							alignItems: 'center'
						}}>
						<Image src="/logo.png" width="0" height="0" sizes="200px" style={{ width: '80%', height: 'auto' }} alt="logo" />
					</div>
				</Footer>
			</Layout>
		</Layout>
	)
}
export default LayoutComponent
