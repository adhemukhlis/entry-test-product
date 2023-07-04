const excelDownloadHandler = (res) => {
	const matcher = 'filename='
	const contentDisposition = res.headers['content-disposition']
	const filenamePropIndex = contentDisposition.indexOf(matcher)
	const fileName = contentDisposition.slice(filenamePropIndex + matcher.length)
	var a = document.createElement('a')
	a.href = URL.createObjectURL(
		new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
	)
	a.download = fileName
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	return res
}
export default excelDownloadHandler
