import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TableList = () => {
	const [tables, setTables] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		// Получаем все ключи из LocalStorage, которые начинаются с "table_"
		const storedTables = Object.keys(localStorage).filter(key =>
			key.startsWith('table_')
		)
		setTables(storedTables)
	}, [])

	const handleDelete = tableName => {
		localStorage.removeItem(tableName)
		setTables(tables.filter(table => table !== tableName))
	}

	const handleView = tableName => {
		navigate(`/view?table=${tableName}`)
	}

	return (
		<div>
			<h2>Загруженные таблицы</h2>
			{tables.length === 0 ? (
				<p>Нет загруженных таблиц.</p> // Сообщение, если нет таблиц
			) : (
				<ul>
					{tables.map((table, index) => (
						<li key={index}>
							{table}
							<button onClick={() => handleView(table)}>Просмотр</button>
							<button onClick={() => handleDelete(table)}>Удалить</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default TableList
