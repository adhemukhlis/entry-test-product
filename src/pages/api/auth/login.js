import { pick } from 'lodash'

import { withSessionRoute } from '@/utils/session-wrapper'
import apiService from '@/utils/apiService'

export default withSessionRoute(async (req, res) => {
	const { email, password } = req.body
	if (req.method === 'POST') {
			try {
				const response = await apiService.request({
					method: 'post',
					url: `/auth/login`,
					data: {
						email,
						password
					}
				})
				const pickProperty = pick(response?.data?.data, ['access_token', 'refresh_token', 'role', 'staff'])
			
				req.session.auth = pickProperty
				await req.session.save()
				res.status(200).send('ok')
			} catch (error) {
				if (error?.response?.status === 404) {
					res.status(404).send({ message: 'Email atau Password Salah!', errors: ['Email atau Password Salah!'] })
				} else {
					res.status(error?.response?.status ?? 500).send(error?.response?.data, error?.response?.data ?? error)
				}
			}
	
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
