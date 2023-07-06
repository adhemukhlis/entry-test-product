import { withSessionRoute } from '@/utils/session-wrapper'
import apiService from '@/utils/apiService'

export default withSessionRoute(async (req, res) => {
	if (req.method === 'GET') {
		try {
			const response = await apiService.request({
				method: 'get',
				url: '/api/tourist-object/tourist-object/',
				headers: {
					Authorization: 'Bearer ' + req.session.auth?.access ?? ''
				},
				params: {
					...req.query
				}
			})
			res.status(200).send(response.data)
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data ?? error)
		}
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
