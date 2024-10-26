import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { csvToJson } from './csvToJson' // Импортируем функцию

const FileUpload = () => {
	const [file, setFile] = useState(null)
	const navigate = useNavigate()

	const handleFileChange = event => {
		setFile(event.target.files[0])
	}

	const handleDrop = event => {
		event.preventDefault()
		const droppedFile = event.dataTransfer.files[0]
		setFile(droppedFile)
	}

	const handleUpload = () => {
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const data = e.target.result

				// Определяем формат файла и преобразуем его
				let parsedData
				if (file.type === 'application/json') {
					parsedData = JSON.parse(data)
				} else if (file.type === 'text/csv') {
					parsedData = csvToJson(data)
				}

				// Сохранение файла в LocalStorage с уникальным идентификатором
				const tableId = `table_${Date.now()}` // Генерация уникального ID для таблицы
				localStorage.setItem(tableId, JSON.stringify(parsedData)) // Сохраняем как JSON
				alert('Файл загружен!')
				navigate('/tables') // Перенаправление на страницу со всеми таблицами
			}
			reader.readAsText(file)
		}
	}

	return (
		<div>
			<h2>Загрузите свой файл CSV или JSON</h2>
			<input type='file' accept='.csv,.json' onChange={handleFileChange} />
			<div
				onDrop={handleDrop}
				onDragOver={e => e.preventDefault()}
				style={{
					border: '2px dashed #ccc',
					padding: '20px',
					textAlign: 'center',
				}}
			>
				Перетащите файл сюда
			</div>
			<button onClick={handleUpload}>Загрузить</button>
		</div>
	)
}

export default FileUpload
