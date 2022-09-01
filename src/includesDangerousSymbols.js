// https:/net-comber.com/charset.html
// Last.fm принимает только латиницу, цифры, "_" и "-"

// "_" - 95
// "-" - 45

// "0" - 48
// "9" - 57

// "A" - 65
// "Z" - 90
// "a" - 97
// "z" - 122
//TODO: избавиться от магических чисел и комментариев при помоищи symbol.charCodeAt()

module.exports = function includesDangerousSymbols(str){
	const checkInTheRange = (from, to, symbol) => symbol.charCodeAt() >= from && symbol.charCodeAt() <= to

	const in0to10 = symbol => checkInTheRange(48, 57, symbol)

	const inAtoZ = symbol => checkInTheRange(65, 90, symbol)

	const in_a_to_z = symbol => checkInTheRange(97, 122, symbol)

	//anti sql comments
	if(str.includes('--')) return true
	
	if(str.length < 2 || str.length > 15) return true

	if(str[0] === '-' || str[0] === '_' || in0to10(str[0])) return true

	for (var i = str.length - 1; i >= 0; i--) {
		if(!(in0to10(str[i]) || inAtoZ(str[i]) || in_a_to_z(str[i]))) return true
	}

	return false
}

