import { useState } from 'react'
import axios from 'axios'

// eslint-disable-next-line react/prop-types
const FileUploader = ({ onUpload }) => {
	const [selectedFile, setSelectedFile] = useState(null)

	const handleFileChange = e => setSelectedFile(e.target.files[0])

	const handleDrop = e => {
		e.preventDefault()
		setSelectedFile(e.dataTransfer.files[0])
	}

	const handleSubmit = async () => {
		if (!selectedFile) return

		const formData = new FormData()
		formData.append('file', selectedFile)

		try {
			const response = await axios.post(
				'http://localhost:8080/file/uploadFile',
				formData,
				{
					params: { fileName: `/${selectedFile.name}` },
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			)

			axios.get(`http://localhost:8080/convert?fileName=${selectedFile.name}`)

			console.log('Файл успешно загружен:', response.data)
			onUpload(selectedFile.name)
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error)
		}
	}

	return (
		<div style={uploaderContainerStyle}>
			<h2 style={headerStyle}>Загрузите файл</h2>
			<input type='file' onChange={handleFileChange} style={fileInputStyle} />
			<div
				onDrop={handleDrop}
				onDragOver={e => e.preventDefault()}
				style={dropZoneStyle}
			>
				{selectedFile ? selectedFile.name : 'Перетащите файл сюда'}
			</div>
			<button onClick={handleSubmit} style={uploadButtonStyle}>
				Загрузить
			</button>
		</div>
	)
}

const uploaderContainerStyle = {
	padding: '20px',
	maxWidth: '500px',
	margin: 'auto',
	textAlign: 'center',
	backgroundColor: '#FFF4E6',
	borderRadius: '12px',
	boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}

const headerStyle = {
	color: '#FF8C42',
	marginBottom: '20px',
}

const fileInputStyle = {
	marginBottom: '10px',
	padding: '10px',
	fontSize: '16px',
	color: '#FF8C42',
	border: '2px solid #FF8C42',
	borderRadius: '8px',
}

const dropZoneStyle = {
	marginTop: '10px',
	padding: '20px',
	border: '2px dashed #FF8C42',
	borderRadius: '8px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#666',
	backgroundColor: '#FFE0B2',
	transition: 'background-color 0.3s',
	'&:hover': {
		backgroundColor: '#FFD54F',
	},
}

const uploadButtonStyle = {
	marginTop: '15px',
	padding: '10px 20px',
	fontSize: '16px',
	color: 'white',
	backgroundColor: '#FF8C42',
	border: 'none',
	borderRadius: '8px',
	cursor: 'pointer',
	transition: 'background-color 0.3s',
	'&:hover': {
		backgroundColor: '#FF6F24',
	},
}

export default FileUploader
