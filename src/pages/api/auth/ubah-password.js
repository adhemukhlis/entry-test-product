import apiService from '@/utils/apiService'
import { withSessionRoute } from '@/utils/session-wrapper'

export default withSessionRoute(async (req, res) => {
	const { old_password, new_password } = req.body
	if (req.method === 'POST') {
		try {
			const response = await apiService.request({
				method: 'post',
				url: '/api/user/user/change-password/',
				headers: {
					Authorization: 'Bearer ' + req.session.auth?.access ?? ''
				},
				data: { old_password, new_password }
			})

			res.status(response.status).send(response.data)
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data, error.response.data ?? error)
		}
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
