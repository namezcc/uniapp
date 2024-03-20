/**
 * 
 * @param {string} str 
 * @param {string} startMarker 
 * @param {string} endMarker 
 * @returns []
 */
function splitByMarkers(str, startMarker, endMarker,nomark) {
    let result = [];
    let startIndex = 0;

	while (startIndex <= str.length) {
		let nsi = str.indexOf(startMarker,startIndex)
		if (nsi == -1) {
			result.push(str.substring(startIndex))
			break
		}

		let nei = str.indexOf(endMarker,nsi)
		if (nei == -1) {
			result.push(str.substring(startIndex))
			break
		}
		nei++
		if (startIndex != nsi) {
			result.push(str.substring(startIndex,nsi))
		}
		if (nomark) {
			result.push(str.substring(nsi+1,nei-1))
		}else{
			result.push(str.substring(nsi,nei))
		}
		startIndex = nei
	}
    return result;
}

export default {
	splitByMarkers
}