import { Modal } from 'antd'
const { error } = Modal
const errorModal = (err) => {
	error({
		title: err.response?.data?.message || 'Something went wrong!',
		content: (
			<>
				<code>status : {err.response.status}</code>
				<ul>
					{(err.response?.data?.errors || ['Something went wrong!']).map((item, index) => (
						<li key={'err-' + index}>{item}</li>
					))}
				</ul>
			</>
		)
	})
}
export default errorModal
