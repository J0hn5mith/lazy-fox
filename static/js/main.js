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
PREDICTION_SERVER_URL = "http://127.0.0.1:8000/api/predict/"
WHITE_SPACE_CODE = 32

var currentPredictions = [];
var selecting = false;

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

function insertTextAtCursor(element, text) {
	//http://stackoverflow.com/questions/3923089/can-i-conditionally-change-the-character-entered-into-an-input-on-keypress
	var sel, range, textNode;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0).cloneRange();
			range.deleteContents();
			textNode = document.createTextNode("abc " + text + " efg");
			range.insertNode(textNode);

			// Move caret to the end of the newly inserted text node
			range.setStart(textNode, textNode.length);
			range.setEnd(textNode, textNode.length);
			sel.removeAllRanges();
			sel.addRange(range);
			element.innerHTML = "hello world";

			sel = window.getSelection();
			sel.removeAllRanges();
			range.setStart(element, textNode.length);
			range.setEnd(element, textNode.length);
			//sel.getRangeAt(0).setStart(element, 0);
			//sel.getRangeAt(0).setEnd(0);
			sel.addRange(range);
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
	data = '{ "sequence": "' + currentWord + '"}'
	$.ajax({
		url: PREDICTION_SERVER_URL,
		type: 'POST',
		data: data,
		success: function(response) {
			var predictions = response.suggestions;
			addPredictions(predictions);
		}
	});
}

function removePredictions() {
	$(PREDICTIONS_LIST).children().remove();
	currentPredicitons = []
}

function addPredictions(predictions) {
	for (prediction of predictions) {
		predictionElement = $(PREDICTIONS_LIST).append(
			"<li>" + prediction + "</li>"
		);
		predictionElement.addClass("input__suggestions-list-item");
		currentPredictions.push(predictionElement);

	}
}

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

function selectPrediction() {}

function highlightPredictions() {
	for(prediction of currentPredictions){
		console.log(prediction);
		prediction.addClass("input__suggestion-list-item--highlighted");
	}
}

window.onload = function() {
	$(TYPE_AREA).keypress(function(evt) {
		if (evt.which) {
			if (evt.keyCode == WHITE_SPACE_CODE) {
				highlightPredictions();
				return false;

			} else {
				var charStr = String.fromCharCode(evt.which);
				var transformedChar = transformTypedCharacter(charStr);
				updatePredictions(transformedChar);
				if (transformedChar != charStr) {
					//insertTextAtCursor(this, transformedChar);
					//return false;
				}
			}
		}
	});
}
