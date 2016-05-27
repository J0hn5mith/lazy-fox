var $ = require('jQuery');
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

KEYS_TO_NUMBER = {
    'a': 0,
    's': 1,
    'd': 2,
    'f': 3,
    'j': 4,
    'k': 5,
    'l': 6,
    ';': 7,
}

TYPE_AREA = "#type-area";
PREDICTIONS_LIST = "#predictions-list";
PREDICTION_SERVER_URL = "http://127.0.0.1:8000/api/predict/";
WHITE_SPACE_CODE = 32;
WHETE_SPACE_STRINGS = [" ", "\xa0"];
AUTO_WHTE_SPACE = false;

var selecting = false;
var typing_word = false;
State = {
    NEUTRAL: 0,
    TYPING: 1,
    SELECTING: 2
};

var state = State.NEUTRAL;

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
}

function addPredictions(predictions) {
    for (prediction of predictions) {
        $(PREDICTIONS_LIST).append(
            '<div class="input__suggestions-list-item">' + prediction +
            "</div>"
        );
    }
}

function getCurrentWord(currentChar) {
    if (currentChar == " ") {
        return null
    }
    var selection = window.getSelection();
    position = selection.anchorOffset
    if (position == 0) {
        return null
    }
    var text = selection.anchorNode.nodeValue.slice(0, selection.anchorOffset);
    text = cleanText(text);
    tokens = text.split(" ");
    var word = cleanWord(tokens[tokens.length - 1]);
    return word
}

function cleanWord(word) {
    cleaned = word.replace(/[\n\t]/g, '');
    return cleaned;
}

function cleanText(text) {
    return text.replace(/\s/g, ' ');
}

function selectPrediction(number) {
    prediction = $(PREDICTIONS_LIST).children()[number].innerHTML;
    var range = deletePreviousWord(prediction, range);
    range = insertWord(prediction, range);
    if (AUTO_WHTE_SPACE) {
        insertWord("\xa0", range);
    }
}

function highlightPredictions() {
    $(PREDICTIONS_LIST).children().addClass(
        "input__suggestion-list-item--highlighted")
}

window.onload = function() {
    $(TYPE_AREA).keypress(function(evt) {
        if (evt.which) {
            var character = String.fromCharCode(evt.which);
            if (state == State.SELECTING) {
                number = characterToNumber(character)
                selectPrediction(number);
                removePredictions();
                state = State.NEUTRAL;
                return false;
            } else if (state == State.TYPING) {
                if (evt.keyCode == WHITE_SPACE_CODE &&
                    getCurrentWord() != null) {
                    highlightPredictions();
                    state = State.SELECTING
                } else {
                    handleCharacterInput(character)
                }
                return false;
            } else if (state == State.NEUTRAL) {
                if (WHETE_SPACE_STRINGS.indexOf(character) >= 0) {
                    var range = getCurrentPosition();
                    insertWord("\xa0", range);
                } else {
                    handleCharacterInput(character)
                }
                state = State.TYPING;
            }
            return false;
        }
        return false;
    })
}

handleCharacterInput = function(character) {
    var transformedChar = transformTypedCharacter(
        character);
    var range = getCurrentPosition();
    insertWord(transformedChar, range);
    updatePredictions(transformedChar);
}

function selectCurrentWord() {
    var range = document.createRange();
    range.selectNodeContents($(TYPE_AREA)[0]);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function replaceCurrentWord(newWord) {
    var selection = window.getSelection();
}

function setCursorPosition(position) {
    return setCursorRange(position, position);
}

function setCursorRange(start, end) {
    var sel, range, typeArea;
    sel = window.getSelection();
    typeArea = $(TYPE_AREA).contents()[0];

    if (sel.getRangeAt != null && sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        sel.removeAllRanges();
    } else {
        range = document.createRange();
        range.selectNode(typeArea);
    }

    range.setStart(typeArea, start);
    range.setEnd(typeArea, end);
    sel.addRange(range);

    return range;
}

function getCurrentPosition() {
    var sel, range;
    sel = window.getSelection();
    range = sel.getRangeAt(0).cloneRange();
    return range;
}

function insertWord(word, range) {
    textNode = document.createTextNode(word);
    textNode.normalize()
    var currentPosition = range.startOffset
    range.insertNode(textNode);
    $(TYPE_AREA)[0].normalize();
    return setCursorPosition(currentPosition + word.length);
}

function deletePreviousWord() {
    var range = selectPreviousWord();
    range.deleteContents();
    return range;
}

function selectPreviousWord() {
    var range = getCurrentPosition();
    var text = getInputText();
    var position = range.startOffset
    var start = position;
    while (start >= 1 && WHETE_SPACE_STRINGS.indexOf(text.charAt(start -
            1)) <
        0) {
        start -= 1;
    }
    return setCursorRange(start, position);
}

function getInputText() {
    var selection = window.getSelection();
    return selection.anchorNode.nodeValue;
}

function characterToNumber(character) {
    return KEYS_TO_NUMBER[character];
}
