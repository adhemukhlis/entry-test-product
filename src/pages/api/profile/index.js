import { withSessionRoute } from '@/utils/session-wrapper'
import apiService from '@/utils/apiService'
// import axios from 'axios'

export default withSessionRoute(async (req, res) => {
	if (req.method === 'PATCH') {
		try {
			const { data } = await apiService.patch('/api/user/user/me/', req, {
				responseType: 'stream',
				headers: {
					'Content-Type': req.headers['content-type'], // which is multipart/form-data with boundary included
					Authorization: 'Bearer ' + req.session.auth?.access ?? ''
				}
			})
			data.pipe(res)
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data ?? error)
		}
	} else if (req.method === 'GET') {
		try {
			const response = await apiService.request({
				method: 'get',
				url: '/api/user/user/me/',
				headers: {
					Authorization: 'Bearer ' + req.session.auth?.access ?? ''
				}
			})
			res.status(200).send(response.data)
		} catch (error) {
			res.status(error?.response?.status ?? 500).send(error?.response?.data ?? error)
		}
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
export const config = {
	api: {
		bodyParser: false
	}
}
