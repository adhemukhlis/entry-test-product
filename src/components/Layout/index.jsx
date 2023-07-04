import { FloatButton, Layout, Menu, Modal, message, theme } from 'antd'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { DatabaseOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { RabbitLegacy, enc } from 'crypto-js'
import Image from 'next/image'
import asyncLocalStorage from '@/utils/async-local-storage'
import menus from '@/config/menu'
const ReactJson = dynamic(() => import('react-json-view'), {
	ssr: false
})
const { Content, Sider } = Layout
const LayoutComponent = ({ children }) => {
	const [authMenu, setAuthMenu] = useState([])
	const [collapsed, setCollapsed] = useState(false)
	const router = useRouter()
	const {
		token: { colorBgContainer }
	} = theme.useToken()

	const currentPath = router.pathname

	const handleSelectMenu = (menu) => {
		if (menu.key === '/logout') {
			axios.request({ method: 'post', url: '/api/auth/logout' }).then((res) => {
				message.info(res.data)
				asyncLocalStorage.setItem('_am', '').then(() => {
					setTimeout(() => {
						router.push('/login')
					}, 1200)
				})
			})
		} else {
			router.push(menu.key)
		}
	}
	const showProps = () =>
		Modal.info({
			title: 'Props Inspector',
			centered: true,
			width: '50vw',
			bodyStyle: { height: '60vh', overflow: 'auto' },
			footer: null,
			icon: null,
			closable: true,
			content: <ReactJson name="props" src={children.props} />
		})
	useEffect(() => {
		asyncLocalStorage.getItem('_am').then((res) => {
			try {
				const decrypted = RabbitLegacy.decrypt(res, process.env.SESSION_KEY).toString(enc.Utf8)
				const localAuthMenu = JSON.parse(decrypted)
				setAuthMenu(localAuthMenu?.menu || [])
			} catch (err) {
				return null
			}
		})
	}, [])
	return (
		<Layout
			style={{
				minHeight: '100vh'
			}}
			hasSider>
			<Sider
				collapsible
				width={250}
				style={{
					backgroundColor: colorBgContainer
				}}
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}>
				<div
					style={{
						height: collapsed ? 100 : 40,
						margin: 16,
						background: colorBgContainer,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}>
					{collapsed ? (
						<div
							style={{
								width: '4rem',
								height: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<Image
								src="/logo-blue.png"
								width="0"
								height="0"
								sizes="600px"
								style={{ width: 'auto', height: '40%', transform: 'rotate(-0.25turn)' }}
								alt="logo"
							/>
						</div>
					) : (
						<div
							style={{
								width: '100%',
								height: '4rem',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<Image
								src="/logo-blue.png"
								width="0"
								height="0"
								sizes="600px"
								style={{ width: '40%', height: 'auto' }}
								alt="logo"
							/>
						</div>
					)}
				</div>
				<Menu
					theme="light"
					defaultSelectedKeys={[currentPath]}
					mode="inline"
					items={menus(authMenu)}
					onSelect={handleSelectMenu}
				/>
			</Sider>
			<Content
				style={{
					margin: '1rem',
					minHeight: 'calc(100vh-2rem)' // minHeight = heigh of screen - (margin top + margin bottom)
				}}>
				<FloatButton shape="circle" style={{ right: 60 }} onClick={showProps} type="primary" icon={<DatabaseOutlined />} />
				<div
					style={{
						padding: 24,
						height: '100%',
						background: colorBgContainer
					}}>
					{children}
				</div>
			</Content>
		</Layout>
	)
}
export default LayoutComponent
