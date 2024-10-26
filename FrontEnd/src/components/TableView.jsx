import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TableView = () => {
	const location = useLocation()
	const query = new URLSearchParams(location.search)
	const tableName = query.get('table') // Получаем имя таблицы из параметров
	const [data, setData] = useState([])
	const [filter, setFilter] = useState('')

	useEffect(() => {
		const storedData = localStorage.getItem(tableName)
		if (storedData) {
			setData(JSON.parse(storedData)) // Устанавливаем данные для отображения
		}
	}, [tableName])

	const filteredData = data.filter(row =>
		Object.values(row).some(value =>
			String(value).toLowerCase().includes(filter.toLowerCase())
		)
	)

	return (
		<div>
			<h2>Просмотр и редактирование таблицы: {tableName}</h2>
			<input
				type='text'
				placeholder='Фильтр...'
				value={filter}
				onChange={e => setFilter(e.target.value)}
			/>
			<table>
				<thead>
					<tr>
						{data[0] &&
							Object.keys(data[0]).map((key, index) => (
								<th key={index}>{key}</th>
							))}
					</tr>
				</thead>
				<tbody>
					{filteredData.slice(0, 100).map((row, rowIndex) => (
						<tr key={rowIndex}>
							{Object.values(row).map((cell, cellIndex) => (
								<td key={cellIndex}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default TableView
