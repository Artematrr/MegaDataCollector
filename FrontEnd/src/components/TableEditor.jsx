import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Header from './Header'
import FilterForm from './FilterForm'
import AddColumnButton from './AddColumnButton'
import DataTable from './DataTable'
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
	const textareaRef = useRef(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8080/getFile/${fileName}`
				)
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

	const handleAddColumn = newColumnName => {
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

	const handleDeleteRow = rowIndex => {
		const newData = tableData.filter((_, index) => index !== rowIndex)
		setTableData(newData)
	}

	const handleDeleteColumn = colIndex => {
		const newColumns = columns.filter((_, index) => index !== colIndex)
		setColumns(newColumns)
		setTableData(prevData =>
			prevData.map(row => {
				const newRow = { ...row }
				delete newRow[columns[colIndex]]
				return newRow
			})
		)
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
			<Header fileName={fileName} />
			{loading ? (
				<div style={loadingStyle}>Загрузка файла...</div>
			) : tableData.length > 0 ? (
				<>
					<FilterForm
						filter={filter}
						setFilter={setFilter}
						rowLimit={rowLimit}
						setRowLimit={setRowLimit}
					/>
					<AddColumnButton handleAddColumn={handleAddColumn} />
					<DataTable
						columns={columns}
						filteredData={filteredData}
						handleCellClick={handleCellClick}
						handleInputChange={handleInputChange}
						editingCell={editingCell}
						textareaRef={textareaRef}
						handleInputBlur={handleInputBlur}
						handleInputKeyDown={handleInputKeyDown}
						handleAddRow={handleAddRow}
						handleDeleteRow={handleDeleteRow}
						handleDeleteColumn={handleDeleteColumn}
					/>
				</>
			) : (
				<p style={{ color: '#FF8C42', textAlign: 'center' }}>Нет данных</p>
			)}
		</div>
	)
}

const loadingStyle = {
	color: '#FF8C42',
	fontSize: '18px',
	textAlign: 'center',
	marginTop: '20px',
	animation: 'loading-animation 1.5s infinite',
}

export default TableEditor
