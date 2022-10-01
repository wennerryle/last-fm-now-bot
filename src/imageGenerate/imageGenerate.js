//TODO: избавиться от зависимости imgBB
require('dotenv').config()
const memoize = require('lodash.memoize')
const Jimp = require('jimp')
const imgbbUploader = require('imgbb-uploader')

module.exports = memoize(async function imageGenerate(nickname = '', author = '', nameOfSong = '',
		album = '', imageURL = 'https://cataas.com/cat'){
	try {
		const albumImage = await Jimp.read(imageURL)

		const albumImageForBackground = await albumImage.clone()
		await albumImageForBackground
			.resize(500, Jimp.AUTO)
			.crop(0, ((albumImageForBackground.bitmap.height - 200) / 2), 500, 200)
			.blur(2)
			.brightness(-0.6)
		const mask = await Jimp.read(__dirname + '/mask.png')

		await albumImage
			.resize(161, 161)
			.mask(mask)

		// let montserratBold = await Jimp.loadFont('montserrat_bold.fnt')
		const notosansRegular = await Jimp.loadFont(__dirname + '/notosans_regular/notosans_regular.fnt')
		const montserratSemiBold = await Jimp.loadFont(__dirname + '/monserrat_semibold/montserrat_semibold.fnt')

		return await albumImageForBackground
			.blit(albumImage, 20, 20)
			.print(notosansRegular, 204, 20, nickname + ' слушает')
			.print(notosansRegular, 204, 62, nameOfSong)
			.print(montserratSemiBold, 204, 94, author)
			.print(notosansRegular, 204, 130, album)
			.getBufferAsync(Jimp.MIME_JPEG) // i not can get base64, i get promise. from https://github.com/oliver-moran/jimp/issues/1056
			.then(data => new Buffer(data).toString('base64'))
			.then(data => {
				return imgbbUploader({
					apiKey: process.env.IMGBB_TOKEN,
					base64string: data
				})
			})

	} catch(err) {
		console.log(err)
	}
})