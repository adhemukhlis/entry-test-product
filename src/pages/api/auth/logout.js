import apiService from '@/utils/apiService'
import { withSessionRoute } from '@/utils/session-wrapper'

export default withSessionRoute(async (req, res) => {
	if (req.method === 'POST') {
		try {
			const response = await apiService.request({
				method: 'post',
				url: '/api/auth/logout/',
				data: { refresh: req.session.auth?.refresh ?? '' }
			})
			await req.session.destroy()
			res.status(response.status).send('Logged out!')
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data, error.response.data ?? error)
		}
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
