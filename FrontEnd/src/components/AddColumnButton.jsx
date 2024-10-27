// eslint-disable-next-line react/prop-types
const AddColumnButton = ({ handleAddColumn }) => {
	const handleClick = () => {
		const newColumnName = prompt('Введите название нового столбца:')
		handleAddColumn(newColumnName)
	}

	return (
		<div style={addRowContainer}>
			<button onClick={handleClick} style={addButtonStyle}>
				+ Добавить столбец
			</button>
		</div>
	)
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
	padding: '10px 15px',
	fontSize: '16px',
}

export default AddColumnButton
