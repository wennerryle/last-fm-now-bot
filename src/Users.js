const createDB = require('./DB.js')

class Users{
	async init(){
		this.db = await createDB({
			codeForInit: `CREATE TABLE IF NOT EXISTS users(
		 	id INTEGER,
		 	nickname TEXT
		 )`,
			filePath: './db.sqlite3'
		})

		console.log('DB created.')
	}

	async isUserExists(id){
		return await this.db.get('SELECT COUNT(*) FROM users WHERE id = ?', [id], function(err, row){
			if(err)
				console.log('CHECKWITHID_err' + err)
			else
				return row
		}).then(res => Object.values(res)[0] > 0)
	}

	async create(id, nickname){
		return await this.db.run(`INSERT INTO users (id, nickname)
			VALUES(?, ?)`, [id, encodeURIComponent(nickname)], function(err, row){
				if(err)
					console.log('CREATE_err: ' + err)
				else
					return row
			})
	}

	async updateNickname(userId, nickname){
		let isUserExists = await this.isUserExists(userId)
		if(isUserExists){
			this.db.run(`UPDATE users SET nickname = ? WHERE id = ?`, [nickname, userId], function(err, row){
				if(err)
					console.log('UPDATE_NICKNAME_err: ' + err)
				else
					return row
			})
		} else
			await this.create(userId, nickname)
	}

	async deleteWithID(id){
		return await this.db.run('DELETE FROM users WHERE id = ?', [id], function(err, row){
			if(err)
				console.log('DELETE_err: ' + err)
			else
				return row
		})
	}

	async getNicknameWithID(id){
		let res = await this.db.get('SELECT nickname FROM users WHERE id = ?', id)
		.then(res => res.nickname)
		.catch(err => console.log(err))
		
		return res;
	}
}

module.exports = Users