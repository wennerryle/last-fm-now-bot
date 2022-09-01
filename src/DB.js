const driver = require('sqlite3')
const { open } = require('sqlite')

module.exports = async function createDB(params){
		const { filePath } = params;

		const db = await open({
			filename: filePath,
			driver: driver.Database,
			mode: driver.OPEN_READWRITE
		})
			.then(res => {
				console.log('Connected to database')
				return res
			})
			.catch(err => console.log('Could not connect to database, ' + err))

		return db
}
