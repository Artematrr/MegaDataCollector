import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FileList = () => {
	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	const fetchFiles = async () => {
		try {
			const response = await axios.get('http://localhost:8080/MyFiles')
			setFiles(response.data)
		} catch (error) {
			console.error('Ошибка при получении списка файлов:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async fileName => {
		const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.')
		try {
			await Promise.all([
				axios.delete(
					`http://localhost:8080/MyFiles/${nameWithoutExtension}.json`
				),
				axios.delete(
					`http://localhost:8080/MyFiles/${nameWithoutExtension}.csv`
				),
			])
			fetchFiles()
		} catch (error) {
			console.error('Ошибка при удалении файла:', error)
		}
	}

	const handleEdit = fileName => {
		navigate(`/edit/${fileName}`)
	}

	useEffect(() => {
		fetchFiles()
	}, [])

	return (
		<div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
			<h2 style={headingStyle}>Загруженные файлы</h2>
			{loading ? (
				<div style={loadingStyle}>Загрузка...</div>
			) : (
				<ul style={{ listStyleType: 'none', padding: 0 }}>
					{files.map((file, index) => (
						<li
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								backgroundColor: '#FFF4E6',
								borderRadius: '8px',
								padding: '10px 15px',
								marginBottom: '10px',
								boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
							}}
						>
							<span
								onClick={() => handleEdit(file)}
								style={{
									cursor: 'pointer',
									color: '#FF8C42',
									fontWeight: 'bold',
									flexGrow: 1,
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
							>
								{file.split('.').slice(0, -1).join('.')}{' '}
							</span>
							<button
								onClick={() => handleDelete(file)}
								style={{
									backgroundColor: '#FF7043',
									color: 'white',
									border: 'none',
									borderRadius: '50%',
									cursor: 'pointer',
									width: '30px',
									height: '30px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: 'bold',
								}}
							>
								&times;
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

const headingStyle = {
	color: '#FF8C42',
	fontSize: '24px',
	textAlign: 'center',
	marginBottom: '20px',
}

const loadingStyle = {
	color: '#FF8C42',
	fontSize: '18px',
	textAlign: 'center',
	marginTop: '20px',
	animation: 'loading-animation 1.5s infinite',
}

export default FileList
