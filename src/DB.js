const driver = require('sqlite3')
const { open } = require('sqlite')

const { access, open: openfs} = require('node:fs/promises')

const { basename } = require('node:path').posix

async function fileExists(filename) {
    try {
        await access(filename);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        } else {
            throw err;
        }
    }
}

module.exports = async function createDB(params){
		const { filePath, codeForInit } = params

		if(!(await fileExists(filePath))){
			const filename = basename(filePath)
			let fh = await openfs(filename, 'a')
			await fh.close()
		}

		const db = await open({
			filename: filePath,
			driver: driver.Database,
			mode: driver.OPEN_READWRITE
		})
			.then(db => {
				console.log('Connected to database')
				return db
			})
			.then(db => db.run(codeForInit))
			.catch(err => console.log('Could not connect to database, ' + err))

		return db
}