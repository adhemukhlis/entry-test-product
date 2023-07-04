import httpProxyMiddleware from 'next-http-proxy-middleware'

// For preventing header corruption, specifically Content-Length header
export const config = {
	api: {
		bodyParser: false
	}
}

const ProxyMiddleware = (req, res) => {
	httpProxyMiddleware(req, res, {
		target: process.env.NEXT_PUBLIC_API_HOST,
		pathRewrite: [
			{
				patternStr: res.req.url,
				replaceStr: '/api/v1/upload'
			}
		]
	})
}
export default ProxyMiddleware
