// https:/net-comber.com/charset.html
// Last.fm принимает только латиницу, цифры, "_" и "-"

module.exports = function includesDangerousSymbols(str){
	const checkInTheRange = (from, to, symbol) => 
		symbol.charCodeAt() >= from.charCodeAt() && symbol.charCodeAt() <= to.charCodeAt()
	//anti sql comments
	if(str.includes('--')) return true
	
	if(str.length < 2 || str.length > 15) return true

	if(str[0] === '-' || str[0] === '_' || checkInTheRange('0', '1', str[0])) return true

	for (var i = str.length - 1; i >= 0; i--) {
		if(!(
			checkInTheRange('0', '10', str[i]) || checkInTheRange('A', 'Z', str[i]) || checkInTheRange('a', 'z', str[i])
		)) return true
	}

	return false
}