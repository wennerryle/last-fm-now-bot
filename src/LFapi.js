const axios = require('axios').default
const url = require('url')

module.exports = class LFapi{
	constructor(apikey){
		this.apikey = apikey
	}

	createGetParams(params){
		return new url.URLSearchParams(params).toString()
	}

	async makeReq(method, params){
		try{
			const urlapi = 'http://ws.audioscrobbler.com/2.0/?method='

			const response = await axios.get(urlapi + method + '&' + this.createGetParams({
					api_key: this.apikey,
					format: 'json',
					...params
			}))
			
			console.log(response.data.recenttracks.track[0].image)

			return response.data
		} catch(error){
			console.log('ERROR: ' + error)
		}
	}
}
