import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import FileUpload from './components/FileUpload'
import TableList from './components/TableList'
import TableView from './components/TableView'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<FileUpload />} />
				<Route path='/tables' element={<TableList />} />
				<Route path='/view' element={<TableView />} />
			</Routes>
		</Router>
	)
}

export default App
