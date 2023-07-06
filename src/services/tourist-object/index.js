import apiService from '@/utils/apiService'
export const getTouristObject = async (query) =>
	await apiService
		.request({
			method: 'get',
			url: '/api/tourist-object/tourist-object/',
			params: { ...query }
		})
		.then((res) => {
			return res
		})
		.catch((err) => {
			throw err
		})
export const getTouristObjectMe = async (access_token, query) =>
	await apiService
		.request({
			method: 'get',
			url: '/api/tourist-object/tourist-object/me/',
			headers: {
				Authorization: `Bearer ${access_token}`
			},
			params: { ...query }
		})
		.then((res) => {
			return res
		})
		.catch((err) => {
			throw err
		})
export const getTouristObjectCategory = async () =>
	await apiService
		.request({
			method: 'get',
			url: '/api/datamaster/tourist-object-category/',
			params: {
				page: 1,
				per_page: Number.MAX_VALUE
			}
		})
		.then((res) => {
			return res
		})
		.catch((err) => {
			throw err
		})
