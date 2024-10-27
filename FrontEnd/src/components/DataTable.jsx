/* eslint-disable react/prop-types */

const DataTable = ({
	columns,
	filteredData,
	handleCellClick,
	handleInputChange,
	editingCell,
	textareaRef,
	handleInputBlur,
	handleInputKeyDown,
	handleAddRow,
	handleDeleteRow,
	handleDeleteColumn,
}) => {
	return (
			<table border='1' cellPadding='10' cellSpacing='0' style={styles.table}>
					<thead>
							<tr style={styles.header}>
									<th style={styles.cell}></th>
									{columns.map((col, colIndex) => (
											<th key={col} style={styles.cell}>
													{col}
													<button
															onClick={() => handleDeleteColumn(colIndex)}
															style={styles.deleteButton}
													>
															-
													</button>
											</th>
									))}
							</tr>
					</thead>
					<tbody>
							{filteredData.map((row, rowIndex) => (
									<tr key={rowIndex} style={styles.row}>
											<td style={styles.cell}>
													<button
															onClick={() => handleDeleteRow(rowIndex)}
															style={styles.deleteButton}
													>
															-
													</button>
											</td>
											{columns.map(col => (
													<td
															key={col}
															style={styles.cell}
															onClick={() => handleCellClick(rowIndex, col)}
													>
															{editingCell.rowIndex === rowIndex && editingCell.colName === col ? (
																	<textarea
																			ref={textareaRef}
																			value={row[col]}
																			onChange={e => handleInputChange(rowIndex, col, e.target.value)}
																			onBlur={handleInputBlur}
																			onKeyDown={handleInputKeyDown}
																			style={styles.textarea}
																			rows={Math.max(1, (row[col].match(/\n/g) || []).length + 1)}
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
											<button onClick={handleAddRow} style={styles.addButton}>
													+ Добавить строку
											</button>
									</td>
							</tr>
					</tbody>
			</table>
	)
}

const styles = {
	table: {
			width: '100%',
			borderCollapse: 'collapse',
			backgroundColor: '#FFF4E6',
			borderRadius: '8px',
			overflow: 'hidden',
	},
	header: {
			backgroundColor: '#FFDDDD',
	},
	row: {
			backgroundColor: '#FFFFFF',
	},
	cell: {
			padding: '10px',
			border: '1px solid #dddddd',
			textAlign: 'left',
	},
	deleteButton: {
			backgroundColor: '#FF4C4C',
			color: 'white',
			border: 'none',
			borderRadius: '4px',
			cursor: 'pointer',
			fontSize: '14px',
			marginLeft: '5px',
			padding: '2px 5px',
	},
	textarea: {
			width: '100%',
			border: '1px solid #cccccc',
			borderRadius: '4px',
			resize: 'none',
	},
	addButton: {
			backgroundColor: '#4CAF50',
			color: 'white',
			border: 'none',
			borderRadius: '4px',
			cursor: 'pointer',
			padding: '10px 15px',
			fontSize: '16px',
	},
}

export default DataTable;