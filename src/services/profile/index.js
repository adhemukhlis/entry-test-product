import apiService from '@/utils/apiService'
export const getProfile = async (access_token) =>
	await apiService
		.request({
			method: 'get',
			url: '/api/user/user/me/',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})
		.then((res) => {
			return res
		})
		.catch((err) => {
			console.log('errrrrr', err.response)
			throw err
		})