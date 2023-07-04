import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
const MainTabs = ({ items = [], activeKey, ...other }) => {
	const router = useRouter()
	return (
		<Tabs
			{...other}
			activeKey={!!activeKey ? activeKey : router.pathname}
			items={items}
			onChange={(key) => router.push(key)}
		/>
	)
}
export default MainTabs
