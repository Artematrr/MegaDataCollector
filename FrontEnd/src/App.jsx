import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import FileUploader from './components/FileUploader'
import FileList from './components/FileList'
import TableEditor from './components/TableEditor'

// eslint-disable-next-line react/prop-types
const Header = ({ lastUploadedFile }) => {
	return (
		<header style={headerStyle}>
			<nav style={navStyle}>
				<Link to='/' style={linkStyle}>
					Загрузить файл
				</Link>
				<Link to='/files' style={linkStyle}>
					Список файлов
				</Link>
				{lastUploadedFile && (
					<Link to={`/edit/${lastUploadedFile}`} style={linkStyle}>
						Редактировать последний файл
					</Link>
				)}
			</nav>
		</header>
	)
}

const headerStyle = {
	backgroundColor: '#FF8C42', 
	padding: '20px',
	textAlign: 'center',
	borderRadius: '12px',
	boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
}

const navStyle = {
	display: 'flex',
	justifyContent: 'center',
	gap: '30px',
}

const linkStyle = {
	color: 'white',
	textDecoration: 'none',
	fontSize: '18px',
	fontWeight: 'bold',
	transition: 'color 0.3s',
	'&:hover': {
		color: '#FFE0B2', 
	},
}

const App = () => {
	const [lastUploadedFile, setLastUploadedFile] = useState(null)

	const fetchLastFile = async () => {
		try {
			const response = await axios.get('http://localhost:8080/MyFiles')
			const files = response.data
			if (files.length > 0) {
				setLastUploadedFile(files[files.length - 1])
			}
		} catch (error) {
			console.error('Ошибка при получении списка файлов:', error)
		}
	}

	useEffect(() => {
		fetchLastFile()
	}, [])

	const handleUpload = fileName => {
		setLastUploadedFile(fileName)
	}

	return (
		<Router>
			<Header lastUploadedFile={lastUploadedFile} />
			<div style={appContainerStyle}>
				<Routes>
					<Route path='/' element={<FileUploader onUpload={handleUpload} />} />
					<Route path='/files' element={<FileList />} />
					<Route path='/edit/:fileName' element={<TableEditor />} />
				</Routes>
			</div>
		</Router>
	)
}

const appContainerStyle = {
	// height: '100%',
	margin: 'auto',
	borderRadius: '12px',
	backgroundColor: '#FFF8F0',
	boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}

export default App
