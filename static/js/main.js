KEYS = {
	'a': 'qaz',
	's': 'wsx',
	'd': 'edc',
	'f': 'rfvtgb',
	'j': 'yhnujm',
	'k': 'ik,',
	'l': 'ol.',
	';': 'p;/',
}
TYPE_AREA = "#type-area"
PREDICTIONS_LIST = "#predictions-list"

keyToChar = {
	" ": " "
}

for (key in KEYS) {
	chars = KEYS[key]
	for (i in chars) {
		c = chars[i];
		keyToChar[c] = key
	}
}

function transformTypedCharacter(c) {
	if (keyToChar[c] != undefined) {
		return keyToChar[c]
	} else {
		console.log("Character not supported: " + c);
	}
	return "";
}

function insertTextAtCursor(text) {
	//http://stackoverflow.com/questions/3923089/can-i-conditionally-change-the-character-entered-into-an-input-on-keypress
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
			this.selectionStart = this.selectionEnd = 100;
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		range.pasteHTML(text);
	}
}

function updatePredictions(character) {
	removePredictions();
	currentWord = getCurrentWord(character);
	if (currentWord == null) {
		return
	}
	predictions = getPredictions(currentWord);
	for (i in predictions) {
		$(PREDICTIONS_LIST).append(
			"<li>" + predictions[i] + "</li>"
		);
	}
}

function removePredictions() {
	$(PREDICTIONS_LIST).children().remove();
}

function addPredictions() {}

function getCurrentWord(currentChar) {
	if (currentChar == " ") {
		return null
	}
	var selection = window.getSelection();
	position = selection.anchorOffset
	if (position == 0) {
		return ""
	}
	preText = selection.anchorNode.nodeValue.slice(0, selection.anchorOffset)
	tokens = preText.split(" ");
	return tokens[tokens.length - 1] + currentChar
}

function getPredictions(word) {
	return [word.slice(0, -1), word.slice(0, -2), word.slice(0, -3)]
}

window.onload = function() {
	$(TYPE_AREA).keypress(function(evt) {
		if (evt.which) {
			var charStr = String.fromCharCode(evt.which);
			var transformedChar = transformTypedCharacter(charStr);
			updatePredictions(transformedChar);
			if (transformedChar != charStr) {
				insertTextAtCursor(transformedChar);
				return false;
			}
		}
	});
}
