keys = {
	'a': 'qaz',
	's': 'wsx',
	'd': 'edc',
	'f': 'rfvtgb',
	'j': 'yhnujm',
	'k': 'ik,',
	'l': 'ol.',
	';': 'p;/',
}

keyToChar = {
	" ": " "
}

for (key in keys) {
	chars = keys[key]
	for (i in chars) {
		c = chars[i];
		keyToChar[c] = key
	}
}

function transformTypedCharacter(c) {
	if (keyToChar[c] != undefined) {
		w = keyToChar[c]
		return keyToChar[c]
	} else {
		console.log("Character not supported: " + c);
	}
	return "";
}

function insertTextAtCursor(text) {
	var sel, range, textNode;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0).cloneRange();
			range.deleteContents();
			textNode = document.createTextNode(text);
			range.insertNode(textNode);

			// Move caret to the end of the newly inserted text node
			range.setStart(textNode, textNode.length);
			range.setEnd(textNode, textNode.length);
			sel.removeAllRanges();
			sel.addRange(range);
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		range.pasteHTML(text);
	}
}

window.onload = function() {
	$("#type-area").keypress(function(evt) {
		if (evt.which) {
			var charStr = String.fromCharCode(evt.which);
			var transformedChar = transformTypedCharacter(charStr);
			if (transformedChar != charStr) {
				insertTextAtCursor(transformedChar);
				return false;
			}
		}
	});
}
