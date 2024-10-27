import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const TableEditor = () => {
	const { fileName } = useParams()
	const [tableData, setTableData] = useState([])
	const [columns, setColumns] = useState([])
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState('')
	const [rowLimit, setRowLimit] = useState(100)
	const [editingCell, setEditingCell] = useState({
		rowIndex: null,
		colName: null,
	})
	const textareaRef = useRef(null) // Ссылка на textarea для управления фокусом

	useEffect(() => {
		const fetchData = async () => {
			try {
				await axios.get(`http://localhost:8080/convert?fileName=${fileName}`)
				const response = await axios.get(`http://localhost:8080/getFile`)
				const data = response.data

				if (data.length > 0) {
					setColumns(Object.keys(data[0]))
					setTableData(data)
				} else {
					setTableData([])
					setColumns([])
				}
			} catch (error) {
				console.error('Ошибка при загрузке таблицы:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [fileName])

	const handleAddRow = () => {
		const newRow = {}
		columns.forEach(col => {
			newRow[col] = ''
		})
		setTableData([...tableData, newRow])
	}

	const handleAddColumn = () => {
		const newColumnName = prompt('Введите название нового столбца:')
		if (newColumnName) {
			setColumns([...columns, newColumnName])
			setTableData(prevData =>
				prevData.map(row => ({
					...row,
					[newColumnName]: '',
				}))
			)
		}
	}

	const handleInputChange = (rowIndex, colName, value) => {
		const newData = [...tableData]
		newData[rowIndex][colName] = value
		setTableData(newData)
	}

	const handleCellClick = (rowIndex, colName) => {
		setEditingCell({ rowIndex, colName })
	}

	const handleInputBlur = () => {
		setEditingCell({ rowIndex: null, colName: null })
	}

	const handleInputKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleInputBlur()
		}
	}

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus() 
		}
	}, [editingCell]) 

	const filteredData = tableData
		.filter(row =>
			Object.values(row).some(value =>
				String(value).toLowerCase().includes(filter.toLowerCase())
			)
		)
		.slice(0, rowLimit)

	return (
		<div style={{ maxWidth: '1900px', margin: 'auto', padding: '20px' }}>
			<h2 style={headingStyle}>Редактирование {fileName}</h2>
			{loading ? (
				<div style={loadingStyle}>Загрузка файла...</div>
			) : tableData.length > 0 ? (
				<>
					<input
						type='text'
						placeholder='Фильтровать...'
						value={filter}
						onChange={e => setFilter(e.target.value)}
						style={inputStyle}
					/>
					<input
						type='number'
						placeholder='Ограничение '
						value={rowLimit}
						onChange={e => setRowLimit(e.target.value)}
						style={inputStyle}
					/>
					<div style={addRowContainer}>
						<button onClick={handleAddColumn} style={addButtonStyle}>
							+
						</button>
					</div>
					<table
						border='1'
						cellPadding='10'
						cellSpacing='0'
						style={{
							width: '100%',
							borderCollapse: 'collapse',
							backgroundColor: '#FFF4E6',
							borderRadius: '8px',
							overflow: 'hidden',
						}}
					>
						<thead>
							<tr style={headerStyle}>
								{columns.map(col => (
									<th key={col} style={cellStyle}>
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filteredData.map((row, rowIndex) => (
								<tr key={rowIndex} style={rowStyle}>
									{columns.map(col => (
										<td
											key={col}
											style={cellStyle}
											onClick={() => handleCellClick(rowIndex, col)}
										>
											{editingCell.rowIndex === rowIndex &&
											editingCell.colName === col ? (
												<textarea
													ref={textareaRef}
													value={row[col]}
													onChange={e =>
														handleInputChange(rowIndex, col, e.target.value)
													}
													onBlur={handleInputBlur}
													onKeyDown={handleInputKeyDown}
													style={textareaCellStyle}
													rows={Math.max(
														1,
														(row[col].match(/\n/g) || []).length + 1
													)}
													cols={5}
												/>
											) : (
												row[col]
											)}
										</td>
									))}
								</tr>
							))}
							<tr>
								<td colSpan={columns.length + 1} style={{ textAlign: 'right' }}>
									<button onClick={handleAddRow} style={addButtonStyle}>
										+ Добавить
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</>
			) : (
				<p style={{ color: '#FF8C42', textAlign: 'center' }}>Нет данных</p>
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

const headerStyle = {
	backgroundColor: '#FF7043',
	color: 'white',
	fontWeight: 'bold',
}

const cellStyle = {
	padding: '10px',
	border: '1px solid #FF8C42',
	textAlign: 'center',
	cursor: 'pointer',
}

const rowStyle = {
	backgroundColor: '#FFF4E6',
}

const inputStyle = {
	margin: '5px',
	padding: '10px',
	border: '1px solid #ccc',
	borderRadius: '4px',
	width: '150px',
}

const textareaCellStyle = {
	width: '100%',
	border: 'none',
	outline: 'none',
	resize: 'none',
	height: 'auto',
	textAlign: 'center',
}

const addRowContainer = {
	display: 'flex',
	justifyContent: 'flex-end',
	marginBottom: '20px',
}

const addButtonStyle = {
	backgroundColor: '#4CAF50',
	color: 'white',
	border: 'none',
	borderRadius: '4px',
	cursor: 'pointer',
	fontSize: '18px',
	width: '30px',
	height: '30px',
}

export default TableEditor
