import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Header from './Header'
import FilterForm from './FilterForm'
import AddColumnButton from './AddColumnButton'
import DataTable from './DataTable'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'

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
	const [chartData, setChartData] = useState(null)
	const [selectedColumns, setSelectedColumns] = useState([])
	const [chartType, setChartType] = useState('bar')
	const chartRef = useRef(null)

	const [chartsData, setChartsData] = useState([])

	const handleExportToPDF = async () => {
		const doc = new jsPDF()

		for (let i = 0; i < chartsData.length; i++) {
			const chartCanvas = chartsData[i]
			const imgData = chartCanvas.toDataURL('image/png')

			doc.addImage(imgData, 'PNG', 10, 10, 180, 160)
			if (i < chartsData.length - 1) {
				doc.addPage()
			}
		}

		doc.save('charts.pdf')
	}

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

	const handleDeleteRow = rowIndex => {
		const newData = tableData.filter((_, index) => index !== rowIndex)
		setTableData(newData)
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

	const handleChartGeneration = () => {
		const intersectionData = {}

		filteredData.forEach(row => {
			const selectedValues = selectedColumns.map(col => row[col])
			const key = selectedValues.join('|')

			if (intersectionData[key]) {
				intersectionData[key] += 1
			} else {
				intersectionData[key] = 1
			}
		})

		const labels = Object.keys(intersectionData)
		const dataValues = Object.values(intersectionData)

		const colors = dataValues.map(
			() =>
				`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
					Math.random() * 255
				)}, ${Math.floor(Math.random() * 255)}, 0.6)`
		)

		setChartData({
			labels: labels,
			datasets: [
				{
					label: 'Пересечение выбранных столбцов',
					data: dataValues,
					backgroundColor: colors,
					borderColor: colors.map(color => color.replace('0.6', '1')),
					borderWidth: 1,
				},
			],
		})

		setChartsData(prev => [...prev, chartRef.current])
	}

	useEffect(() => {
		if (chartData) {
			const ctx = chartRef.current.getContext('2d')

			if (ctx.chart) {
				ctx.chart.destroy()
			}

			const config = {
				type: chartType,
				data: {
					labels: chartData.labels,
					datasets: [
						{
							label: 'Количество',
							data: chartData.datasets[0].data,
							backgroundColor: chartData.datasets[0].backgroundColor,
							borderColor: chartData.datasets[0].borderColor,
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'top',
						},
						title: {
							display: true,
							text: 'Диаграмма данных',
						},
					},
				},
			}

			ctx.chart = new Chart(ctx, config)
		}
	}, [chartData, chartType])

	const handleExportChart = () => {
		if (chartRef.current) {
			const chartCanvas = chartRef.current

			chartCanvas.toBlob(blob => {
				if (blob) {
					const url = URL.createObjectURL(blob)
					const a = document.createElement('a')
					a.href = url
					a.download = 'chart.png'
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
					URL.revokeObjectURL(url)
				}
			}, 'image/png')
		}
	}

	const handleCopyChart = async () => {
		if (chartRef.current) {
			const chartCanvas = chartRef.current
			const imageData = chartCanvas.toDataURL('image/png')

			try {
				await navigator.clipboard.write([
					new ClipboardItem({
						['image/png']: fetch(imageData).then(res => res.blob()),
					}),
				])
				alert('График скопирован в буфер обмена!')
			} catch (err) {
				console.error('Ошибка при копировании графика:', err)
			}
		}
	}

	const handleExportToJson = async () => {
		if (tableData.length === 0) {
			console.error('Нет данных для экспорта.')
			return
		}

		const columns = Object.keys(tableData[0])

		const tableDataJson = tableData.map(row => {
			const rowData = {}
			columns.forEach(column => {
				rowData[column] = row[column]
			})
			return rowData
		})

		const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.')
		// console.log(nameWithoutExtension)
		// console.log(fileName)

		const formData = new FormData()
		formData.append(
			'file',
			new Blob([JSON.stringify(tableDataJson)], { type: 'application/json' }),
			`${nameWithoutExtension}.json`
		)

		try {
			const response = await axios.post(
				'http://localhost:8080/file/uploadFile',
				formData,
				{
					params: { fileName: `/${fileName}` },
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)

			await axios.get(`http://localhost:8080/convert?fileName=${fileName}`)

			console.log('Таблица успешно экспортирована:', response.data)
		} catch (error) {
			console.error('Ошибка при экспорте таблицы:', error)
		}
	}

	return (
		<div style={{ maxWidth: '1900px', margin: 'auto', padding: '20px' }}>
			<Header fileName={fileName} />
			{loading ? (
				<div style={{ textAlign: 'center' }}>Загрузка файла...</div>
			) : tableData.length > 0 ? (
				<>
					<FilterForm
						filter={filter}
						setFilter={setFilter}
						rowLimit={rowLimit}
						setRowLimit={setRowLimit}
					/>
					<AddColumnButton
						handleAddColumn={columnName => setColumns([...columns, columnName])}
					/>
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
						handleDeleteColumn={colIndex => {
							const newColumns = columns.filter(
								(_, index) => index !== colIndex
							)
							setColumns(newColumns)
							const newData = tableData.map(row => {
								const newRow = { ...row }
								delete newRow[columns[colIndex]]
								return newRow
							})
							setTableData(newData)
						}}
					/>
					<div style={{ margin: '20px 0' }}>
						<h3 style={styles.heading}>Выберите столбцы для графика:</h3>
						{columns.map((col, index) => (
							<label key={index} style={styles.label}>
								<input
									type='checkbox'
									checked={selectedColumns.includes(col)}
									onChange={() => {
										if (selectedColumns.includes(col)) {
											setSelectedColumns(selectedColumns.filter(c => c !== col))
										} else {
											setSelectedColumns([...selectedColumns, col])
										}
									}}
									style={styles.checkbox}
								/>
								{col}
							</label>
						))}
						<select
							value={chartType}
							onChange={e => setChartType(e.target.value)}
							style={styles.select}
						>
							<option value='bar'>Гистограмма</option>
							<option value='pie'>Круговая диаграмма</option>
						</select>

						<div style={styles.buttonContainer}>
							<button
								style={styles.actionButton}
								onMouseEnter={e =>
									(e.target.style.backgroundColor =
										styles.actionButtonHover.backgroundColor)
								}
								onMouseLeave={e =>
									(e.target.style.backgroundColor =
										styles.actionButton.backgroundColor)
								}
								onClick={handleChartGeneration}
							>
								Сгенерировать график
							</button>
							<button
								style={styles.secondaryButton}
								onMouseEnter={e =>
									(e.target.style.backgroundColor =
										styles.secondaryButtonHover.backgroundColor)
								}
								onMouseLeave={e =>
									(e.target.style.backgroundColor =
										styles.secondaryButton.backgroundColor)
								}
								onClick={handleExportChart}
							>
								Экспортировать диаграмму
							</button>
							<button
								style={styles.secondaryButton}
								onMouseEnter={e =>
									(e.target.style.backgroundColor =
										styles.secondaryButtonHover.backgroundColor)
								}
								onMouseLeave={e =>
									(e.target.style.backgroundColor =
										styles.secondaryButton.backgroundColor)
								}
								onClick={handleCopyChart}
							>
								Копировать диаграмму
							</button>
							<button
								style={styles.actionButton}
								onMouseEnter={e =>
									(e.target.style.backgroundColor =
										styles.actionButtonHover.backgroundColor)
								}
								onMouseLeave={e =>
									(e.target.style.backgroundColor =
										styles.actionButton.backgroundColor)
								}
								onClick={handleExportToJson}
							>
								Сохранить таблицу
							</button>
							<button
								style={styles.secondaryButton}
								onClick={handleExportToPDF}
							>
								Экспортировать в PDF
							</button>
						</div>
					</div>
					<canvas ref={chartRef} style={{ width: '100%', height: '400px' }} />
				</>
			) : (
				<div style={{ textAlign: 'center' }}>Нет данных для отображения</div>
			)}
		</div>
	)
}

const styles = {
	buttonContainer: {
		display: 'flex',
		gap: '10px',
		margin: '20px 0',
		justifyContent: 'center',
	},
	actionButton: {
		backgroundColor: '#4CAF50',
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		padding: '10px 20px',
		fontSize: '14px',
		transition: 'background-color 0.3s ease',
	},
	actionButtonHover: {
		backgroundColor: '#45A049',
	},
	secondaryButton: {
		backgroundColor: '#008CBA',
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		padding: '10px 20px',
		fontSize: '14px',
		transition: 'background-color 0.3s ease',
	},
	secondaryButtonHover: {
		backgroundColor: '#007bb5',
	},
	heading: {
		fontSize: '18px',
		marginBottom: '10px',
		color: '#333',
	},
	label: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '5px',
		fontSize: '16px',
		color: '#555',
		cursor: 'pointer',
	},
	checkbox: {
		marginRight: '8px',
	},
	select: {
		marginLeft: '10px',
		padding: '5px',
		borderRadius: '4px',
		border: '1px solid #ccc',
		fontSize: '14px',
		cursor: 'pointer',
	},
}

export default TableEditor
