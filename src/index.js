//TODO: разделить бизнес логику и реализацию
//TODO: вынести сообщения в отдельный файл
require('dotenv').config()
const { Telegraf }= require('telegraf')
const { v4: uuidv4 } = require('uuid')
const imageGenerate = require('./imageGenerate/imageGenerate.js')

const includesDangerousSymbols = require('./includesDangerousSymbols.js')
const LFapi = require('./LFapi.js');
const api = new LFapi(process.env.LAST_FM_TOKEN)

const bot = new Telegraf(process.env.BOT_TOKEN)

const Users = require('./Users.js')
const users = new Users()

users.init()

const messages = {
	onHelp: `@vkxci - лучший плеер
Если вы хотите связаться с автором
-  @wennerryle`,

	onStart1: 'Привет. Я использую last.fm в качестве поставщика музыки, для отправки музыки, которую ты слушаешь прямо сейчас.',
	onStart2: 'Поэтому для продолжения введи свой ник при помощи команды /nickname %НИК на last.fm%.',
	onStart3: 'Пример:\n\n' +
	'"/nickname wennerryle"\n' + 
	'Для дополнительной информации:\n/help',

	botOnReload: 'Попробуйте снова через минуту, бот находится в перезапуске',
	badNickname: 'Ваш никнейм не может быть таким ;)\n' + 
	'Введите /nickname и ваш ник с last.fm',

	afterSetNickname: 'Круто! Теперь попробуйте ввести @wennernowbot и посмотрите что получится!',
	ifNotSendNickname: 'Чтобы поставить ник, или его обновить введите\n' +
	'/nickname и ваш никнейм на last.fm',
}

bot.start(async ctx => startMessage(ctx))

async function startMessage(ctx){
		await ctx.reply(messages.onStart1)
		await ctx.reply(messages.onStart2)
		await ctx.reply(messages.onStart3)
}

bot.command('/help', ctx => ctx.reply(messages.onHelp))


bot.command('/nickname', async (ctx) => {
	let text = ctx.update.message.text
	let userID = ctx.update.message.from.id
	let newNickname = text.split(' ')[1]
	
	if(newNickname === undefined)
		return ctx.reply(messages.ifNotSendNickname)

	if(!users.db)
		return ctx.reply(messages.botOnReload)
	
	if(includesDangerousSymbols(newNickname))
			return ctx.reply(messages.badNickname)

	await users.updateNickname(userID, newNickname)
	return ctx.reply(messages.afterSetNickname)
})

bot.on('inline_query', async (ctx) => {
	const ID = ctx.update.inline_query.from.id
	const username = '@' + ctx.update.inline_query.from.username
	const isUserExists = await users.isUserExists(ID)

	if (!isUserExists){
		return ctx.answerInlineQuery([], {
			is_personal: true,
			switch_pm_text: 'Для продолжения авторизируйтесь',
			switch_pm_parameter: '1',
			cache_time: 0,
		})
	}

	let tracks = await api.makeReq('user.getrecenttracks', {
		limit: 1,
		user: await users.getNicknameWithID(ID)
	})

	console.log(tracks.recenttracks.track)
	// tracks.recenttracks.track.forEach(e => console.log(e.image))
	if(tracks === undefined){
		return ctx.answerInlineQuery([], {
			is_personal: true,
			switch_pm_text: 'Введите ник last.fm',
			switch_pm_parameter: '1',
			cache_time: 0,
		})
	}

	let lastTrack = tracks.recenttracks.track[0]
	if(lastTrack === undefined){
		return ctx.answerInlineQuery([], {
			is_personal: true,
			switch_pm_parameter: '1',
			switch_pm_text: 'Вы сейчас ничего не слушаете',
			cache_time: 0,
		})
	}
	
	const artist = lastTrack.artist['#text']
	const titleOfSong = lastTrack.name
	const album = lastTrack.album['#text']
	const image = lastTrack.image[2]['#text'] || 'https://cataas.com/cat'
	
	const urlImage = await imageGenerate(username, artist, titleOfSong, album, image)
	
	console.log(urlImage.image.url)

	const res = [{
   		type: 'photo',
   		id: uuidv4(),
   		photo_url: urlImage.image.url,
   		thumb_url: urlImage.image.url,
		input_message_content: {message_text: artist + ' - ' + titleOfSong}
	}]


	return ctx.answerInlineQuery(res, {
		is_personal: true,
		cache_time: 0,
	})
})


bot.launch()