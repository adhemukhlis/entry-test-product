import { withSessionRoute } from '@/utils/session-wrapper'
import apiService from '@/utils/apiService'

export default withSessionRoute(async (req, res) => {
	if (req.method === 'GET') {
		try {
			const response = await apiService.request({
				method: 'get',
				url: '/api/datamaster/tourist-object-category/',
				params: {
					page: 1,
					per_page: Number.MAX_VALUE
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
