/**
 *  const imgUrl = 'https://image.jpg'
 * 
 *  const handleUpload = (file) => {
			if (file !== undefined) {
				var bodyFormData = new FormData()
				bodyFormData.append('photo', file)
				ApiService.request({
					method: 'POST',
					url: API_URLS.PROFILE_CHANGE_PICTURE,
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data'
					},
					data: bodyFormData
				})
					.then((response) => {
						return response
					})
					.catch((error) => {
						throw error
					})
			}
		}
 *
 *  <UploadProfile onReadyUpload={handleUpload} imageUrl={imgUrl} /> 
 */

import React, { useState, useEffect } from 'react'
import { Upload, message, Modal, Button } from 'antd'
import { LoadingOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import 'antd/es/modal/style'
import 'antd/es/slider/style'

const allowFileType = ['image/jpeg', 'image/png', 'image/jpg']
const generateRandomKey = () => `${Math.floor(Math.random() * 1000000000)}`
export const messageError = (msg) => {
	const msgKey = generateRandomKey()
	message.error({
		key: msgKey,
		duration: 12,
		content: (
			<>
				{msg}
				<Button
					style={{ marginLeft: '0.6rem' }}
					size="small"
					type="text"
					icon={<CloseOutlined style={{ margin: 'auto' }} />}
					onClick={() => message.destroy(msgKey)}
				/>
			</>
		)
	})
}
const UploadProfile = ({ maxSize, aspect, onReadyUpload, imageUrl }) => {
	const [loading, setLoading] = useState(false)
	const [fileList, setFileList] = useState([])
	useEffect(() => {
		const initState = [
			{
				uid: generateRandomKey(),
				name: 'Photo',
				status: 'done',
				...(typeof imageUrl === 'string'
					? { url: imageUrl }
					: imageUrl !== null && imageUrl !== undefined
					? {
							originFileObj: imageUrl
					  }
					: {})
			}
		]
		setFileList(initState)
	}, [imageUrl])
	const [previewVisible, setPreviewVisible] = useState(false)
	const [previewImage, setPreviewImage] = useState(undefined)
	const [previewTitle, setPreviewTitle] = useState(undefined)
	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = (error) => reject(error)
		})
	}
	const handleRemove = () => {
		setFileList([])
		onReadyUpload(undefined)
	}
	const beforeUpload = (file) => {
		const isJpgOrPng = allowFileType.includes(file.type)
		if (!isJpgOrPng) {
			handleRemove()
			messageError('You can only upload JPG/PNG file!')
		}

		const isLt2M = file.size / 1024 / 1024 < maxSize
		if (!isLt2M) {
			handleRemove()
			messageError(`Image must smaller than ${maxSize}MB!`)
		}
		return false
	}
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}
		setPreviewImage(file.url || file.preview)
		setPreviewVisible(true)
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
	}
	const handleChange = async ({ fileList: newFileList }) => {
		if (newFileList.length !== 0) {
			console.log(newFileList)
			if (allowFileType.includes(newFileList[0].type)) {
				// setFile(true)
				// setFileList(newFileList)
				setLoading(false)
				onReadyUpload(newFileList[0].originFileObj)
			} else {
				handleRemove()
			}
		}
	}

	const handleCancel = () => setPreviewVisible(false)

	const uploadButton = (
		<div>
			{loading ? (
				<LoadingOutlined
					style={{
						fontSize: 28,
						color: 'rgba(0,0,0,0.85)'
					}}
				/>
			) : (
				<UploadOutlined
					style={{
						fontSize: 28,
						color: 'rgba(0,0,0,0.85)'
					}}
				/>
			)}
			<div
				style={{
					marginTop: 8,
					color: 'rgba(0,0,0,0.85)'
				}}>
				Upload
			</div>
		</div>
	)
	return !isEmpty(imageUrl) ? (
		<div id="upload-profile">
			{/* <ImgCrop aspect={4 / 3} rotate> */}
			<Upload
				loading
				name="image-file"
				listType="picture-card"
				fileList={fileList}
				onPreview={handlePreview}
				beforeUpload={beforeUpload}
				onChange={handleChange}
				onRemove={handleRemove}>
				{fileList.length === 0 && uploadButton}
			</Upload>
			{/* </ImgCrop> */}
			<Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
				<img
					alt="example"
					style={{
						width: '100%'
					}}
					src={previewImage}
				/>
			</Modal>
		</div>
	) : null
}

UploadProfile.defaultProps = {
	onReadyUpload: (value) => {},
	maxSize: 2,
	aspect: 1,
	imageUrl: ''
}
UploadProfile.propTypes = {
	onReadyUpload: PropTypes.func,
	maxSize: PropTypes.number,
	aspect: PropTypes.number,
	imageUrl: PropTypes.any
}
export default UploadProfile
