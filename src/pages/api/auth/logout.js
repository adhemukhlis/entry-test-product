import { withSessionRoute } from '@/utils/session-wrapper'

export default withSessionRoute(async (req, res) => {
	if (req.method === 'POST') {
		try {
			await req.session.destroy()
			res.status(200).send('Logged out!, redirecting to Login Page')
		} catch (error) {
			res.status(error.response.status ?? 500).send(error.response.data, error.response.data ?? error)
		}
	} else {
		res.status(405).send({ message: 'Method not allowed' })
	}
})
