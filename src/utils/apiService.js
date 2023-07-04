import axios from 'axios'

const apiService = axios.create({
	baseURL: process.env.NEXT_PUBLIC_KOSTZY_API_HOST,
	timeout: 12000
})

export default apiService
