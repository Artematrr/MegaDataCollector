// eslint-disable-next-line react/prop-types
const FilterForm = ({ filter, setFilter, rowLimit, setRowLimit }) => {
	return (
		<div>
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
		</div>
	)
}

const inputStyle = {
	margin: '5px',
	padding: '10px',
	border: '1px solid #ccc',
	borderRadius: '4px',
	width: '150px',
}

export default FilterForm