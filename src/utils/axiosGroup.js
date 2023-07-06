/**
 * 
[
	{
		status : number,
		url : string,
		response : axios result,
		error: axios error => error.response
	}
]

axiosReq1.status
axiosReq1.url
axiosReq1.response
axiosReq1.error.response.data
axiosReq1.error.response.status
 * 
 * 
 */
const axiosGroup = async (axiosRequests) => {
	return await Promise.all(
		axiosRequests.map((req) =>
			req
				.then((res) => {
					const {
						status,
						config: { url }
					} = res
					const _res = { status, url, response: res, error: undefined }
					return _res
				})
				.catch((err) => {
					const {
						response: {
							data,
							status,
							config: { url }
						}
					} = err
					const _res = {
						status,
						url,
						response: undefined,
						error: { response: { status, data: typeof data !== 'string' ? data : { message: 'unknown server error!' } } }
					}
					return _res
				})
		)
	)
}
export default axiosGroup
