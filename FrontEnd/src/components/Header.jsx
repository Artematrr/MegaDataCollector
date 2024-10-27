// eslint-disable-next-line react/prop-types
const Header = ({ fileName }) => {
	return (
		<h2 style={headingStyle}>Редактирование {fileName}</h2>
	)
}

const headingStyle = {
	color: '#FF8C42',
	fontSize: '24px',
	textAlign: 'center',
	marginBottom: '20px',
}

export default Header