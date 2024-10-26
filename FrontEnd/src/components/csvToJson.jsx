export const csvToJson = csv => {
	const lines = csv.split('\n')
	const headers = lines[0].split(',')

	return lines.slice(1).map(line => {
		const values = line.split(',')
		return headers.reduce((obj, header, index) => {
			obj[header.trim()] = values[index]?.trim() || null
			return obj
		}, {})
	})
}
