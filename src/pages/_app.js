import '@/styles/globals.css'
import React from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { useRouter } from 'next/router'
import { getIronSession } from 'iron-session'
import axios from 'axios'
import { has } from 'lodash'
import sessionOptions from '@/utils/sessionOptions'
import PUBLIC_PAGE_URL from '@/config/public-page-url'
import LayoutComponent from '@/components/Layout'
import { NavbarContextProvider } from '@/context/navbar'
// require('@/utils/mock-adapter')
if (!process.browser) React.useLayoutEffect = React.useEffect
const App = ({ Component, pageProps, profileData, isLoggedIn }) => {
	const router = useRouter()
	return (
		<StyleProvider hashPriority="high">
			<ConfigProvider
				theme={{
					token: {
						fontFamily: 'verdana',
						colorPrimary: '#F7911A'
					}
				}}>
				<NavbarContextProvider defaultValues={{...profileData, isLoggedIn}}>
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
				</NavbarContextProvider>
			</ConfigProvider>
		</StyleProvider>
	)
}
App.getInitialProps = async ({ Component, ctx }) => {
	let session = {}
	let url = {}
	let profileData = {}
	let isLoggedIn = false
	try {
		session = await getIronSession(ctx.req, ctx.res, sessionOptions)
		const nextRequestMeta = ctx.req[Reflect.ownKeys(ctx.req).find((s) => String(s) === 'Symbol(NextRequestMeta)')]
		url = new URL(nextRequestMeta.__NEXT_INIT_URL)
	} catch (error) {
		//
	}
	if (has(session, 'auth.access')) {
		isLoggedIn = true
		await axios
			.request({
				method: 'get',
				baseURL: url?.origin,
				headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
				url: '/api/profile'
			})
			.then((res) => {
				profileData = res.data.data
			})
	}
	let pageProps = {}
	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx)
	}
	return { pageProps, profileData, isLoggedIn }
}
export default App
