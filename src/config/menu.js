import { DashboardOutlined } from '@ant-design/icons'

/**
 * key === path page without trailing slash, check window.location.pathname
 */

const menus = [
	{
		key: '/home',
		label: 'Home',
		icon: <DashboardOutlined />
	}
]

export default menus
