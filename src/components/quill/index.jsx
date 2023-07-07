'use client'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
const QuillComponent = ({ token, userId, ...props }) => {
	return (
		<ReactQuill
			{...props}
			// onChange={(val) => {
			//   const replaceSingleQuote = val.replace(`"`, `'`).replace(`"`,`'`)
			//   props.onChange(replaceSingleQuote)
			// }}
			formats={[
				'header',
				'bold',
				'italic',
				'underline',
				'strike',
				'blockquote',
				'list',
				'bullet',
				'indent',
				'link',
				'image'
			]}
			theme="snow"
		/>
	)
}
export default QuillComponent
