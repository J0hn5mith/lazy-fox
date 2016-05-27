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

State = {
    NEUTRAL: 0,
    TYPING: 1,
    SELECTING: 2
};

TYPE_AREA = "#type-area";
PREDICTIONS_LIST = "#predictions-list";
PREDICTION_SERVER_URL = "http://127.0.0.1:8000/api/predict/";
WHITE_SPACE_CODE = 32;
BACK_SPACE_CODE = 8;
WHETE_SPACE_STRINGS = [" ", "\xa0"];
AUTO_WHTE_SPACE = false;

var state = State.NEUTRAL;
var current_word_length = 0;

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

transformTypedCharacter = function(c) {
    if (keyToChar[c] != undefined) {
        return keyToChar[c]
    } else {
        console.log("Character not supported: " + c);
    }
    return "";
}

updatePredictions = function(character) {
    removePredictions();
    currentWord = getCurrentWord(character);
    console.log(currentWord);
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

removePredictions = function() {
    $(PREDICTIONS_LIST).children().remove();
}

addPredictions = function(predictions) {
    for (prediction of predictions) {
        $(PREDICTIONS_LIST).append(
            '<div class="input__suggestions-list-item">' + prediction +
            "</div>"
        );
    }
}

getCurrentWord = function(currentChar) {

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
    return text.slice(position - current_word_length, position);
}

cleanWord = function(word) {
    cleaned = word.replace(/[\n\t]/g, '');
    return cleaned;
}

cleanText = function(text) {
    return text.replace(/\s/g, ' ');
}

selectPrediction = function(number) {
    console.log($(PREDICTIONS_LIST).children().length);
    if (number >= $(PREDICTIONS_LIST).children().length) {
        return false
    }
    prediction = $(PREDICTIONS_LIST).children()[number].innerHTML;
    var range = deletePreviousWord(prediction, range);
    range = insertWord(prediction, range);
    if (AUTO_WHTE_SPACE) {
        insertWord("\xa0", range);
    }
    return true
}

highlightPredictions = function() {
    $(PREDICTIONS_LIST).children().addClass(
        "input__suggestion-list-item--highlighted")
}

window.onload = function() {
    $(TYPE_AREA).keypress(function(evt) {
        console.log(current_word_length);
        if (evt.which) {
            var character = String.fromCharCode(evt.which);
            if (state == State.SELECTING) {
                number = characterToNumber(character)
                if (!selectPrediction(number)) {
                    console.log("Invalid selection");
                    return false;
                }
                removePredictions();
                changeState(State.NEUTRAL);
            } else if (state == State.TYPING) {
                if (evt.keyCode == WHITE_SPACE_CODE &&
                    getCurrentWord() != null) {
                    highlightPredictions();
                    changeState(State.SELECTING);
                } else {
                    handleCharacterInput(character)
                }
            } else if (state == State.NEUTRAL) {
                if (WHETE_SPACE_STRINGS.indexOf(character) >= 0) {
                    var range = getCurrentPosition();
                    insertWord("\xa0", range);
                } else {
                    handleCharacterInput(character)
                }
                changeState(State.TYPING);
            }
        }
        return false;
    })
}

handleCharacterInput = function(character) {
    var transformedChar = transformTypedCharacter(
        character);
    var range = getCurrentPosition();
    insertWord(transformedChar, range);
    current_word_length = current_word_length + character.length
    updatePredictions(transformedChar);
}

selectCurrentWord = function() {
    var range = document.createRange();
    range.selectNodeContents($(TYPE_AREA)[0]);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

replaceCurrentWord = function(newWord) {
    var selection = window.getSelection();
}

setCursorPosition = function(position) {
    return setCursorRange(position, position);
}

setCursorRange = function(start, end) {
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

getCurrentPosition = function() {
    var sel, range;
    sel = window.getSelection();
    range = sel.getRangeAt(0).cloneRange();
    return range;
}

insertWord = function(word, range) {
    textNode = document.createTextNode(word);
    textNode.normalize()
    var currentPosition = range.startOffset
    range.insertNode(textNode);
    $(TYPE_AREA)[0].normalize();
    return setCursorPosition(currentPosition + word.length);
}

deletePreviousWord = function() {
    var range = selectPreviousWord();
    range.deleteContents();
    return range;
}

selectPreviousWord = function() {
    var range = getCurrentPosition();
    var text = getInputText();
    var position = range.startOffset
    var start = position;
    while (start >= 1 && WHETE_SPACE_STRINGS.indexOf(text.charAt(start -
            1)) <
        0) {
        start -= 1;
    }
    return setCursorRange(position - current_word_length, position);
}

getInputText = function() {
    var selection = window.getSelection();
    return selection.anchorNode.nodeValue;
}

characterToNumber = function(character) {
    return KEYS_TO_NUMBER[character];
}

changeState = function(new_state) {
    if (new_state == State.NEUTRAL) {
        current_word_length = 0;
    }
    state = new_state;
}
