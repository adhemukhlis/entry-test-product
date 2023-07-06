const nextConfig = {
	publicRuntimeConfig: {
		// Will be available on both server and client
		AppName: 'Entry Test'
	},
	env: {
		API_HOST: process.env.NEXT_PUBLIC_API_HOST,
		SESSION_KEY: process.env.SESSION_KEY
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'api-entrytest.sandboxindonesia.id',
				port: '',
				pathname: '/media/tourist_object/**'
			}
		]
	},
	eslint: {
		dirs: ['.']
	},
	poweredByHeader: false,
	trailingSlash: false,
	transpilePackages: ['antd'],
	reactStrictMode: false
	// api: {
	// 	externalResolver: true
	// }
}

module.exports = nextConfig
