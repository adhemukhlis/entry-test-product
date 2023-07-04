import { withSession } from '@/utils/session-wrapper'
const RedirectEmpty = () => {
	return <></>
}
export default RedirectEmpty
export const getServerSideProps = withSession(async () => {
	return {
		redirect: {
			destination: '/forgot-password',
			permanent: false
		}
	}
})
