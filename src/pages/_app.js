import '@/styles/globals.css'
import React from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { useRouter } from 'next/router'
import PUBLIC_PAGE_URL from '@/config/public-page-url'
import LayoutComponent from '@/components/Layout'
// require('@/utils/mock-adapter')
if (!process.browser) React.useLayoutEffect = React.useEffect
const App = ({ Component, pageProps }) => {
	const router = useRouter()
	return (
		<StyleProvider hashPriority="high">
			<ConfigProvider
				theme={{
					token: {
						fontFamily: 'verdana'
					}
				}}>
				{PUBLIC_PAGE_URL.includes(router.pathname) ? (
					<div
						style={{
							minHeight: '100vh', // minHeight = heigh of screen - (margin top + margin bottom)
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
						<Component {...pageProps} />
					</div>
				) : (
					<LayoutComponent>
						<Component {...pageProps} />
					</LayoutComponent>
				)}
			</ConfigProvider>
		</StyleProvider>
	)
}

export default App
