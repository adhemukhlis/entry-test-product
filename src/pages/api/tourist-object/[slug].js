import { withSessionRoute } from '@/utils/session-wrapper'
import apiService from '@/utils/apiService'

export default withSessionRoute(async (req, res) => {
	if (req.method === 'DELETE') {
		try {
			const response = await apiService.request({
				method: 'delete',
				url: `/api/tourist-object/tourist-object/${req.query.slug}`,
				headers: {
					Authorization: 'Bearer ' + req.session.auth?.access ?? ''
				}
			})
			res.status(204).send(response.data)
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data ?? error)
		}
	} else if (req.method === 'PATCH') {
		try {
			const { data } = await apiService.patch(`/api/tourist-object/tourist-object/${req.query.slug}`, req, {
				responseType: 'stream',
				headers: {
					'Content-Type': req.headers['content-type'],
					Authorization: 'Bearer ' + req.session.auth?.access ?? ''
				}
			})
			data.pipe(res)
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data ?? error)
		}
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
