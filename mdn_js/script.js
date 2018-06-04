var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
var synth = window.speechSynthesis;
recognition.lang = 'en-US';
recognition.maxAlternatives = 5; // TODO alternative numbers available
var phraseList = [ // TODO should ask the user
  "the horse is very large",
  "the giraffe is very tall",
  "the lion roars",
  "the cat and dog are friends"
]


var iterator = 0;

updatePhrase();
updatePhraseNumber();

document.getElementById("nextPhrase").onclick = function() {
  iterator = iterator + 1;
  updatePhrase();
  updatePhraseNumber();
  document.getElementById("nextPhrase").disabled = true;
  document.getElementById("userSaid").innerHTML = "<em>Please repeat the phrase</em>";
  checkIfFinished();
}

function checkIfFinished() {
  if (iterator >= phraseList.length) {
    document.getElementById("phraseNumber").innerHTML = "";
    document.getElementById("mainBody").innerHTML = '<div class="card-body"></div>';
  }
}

function updatePhraseNumber() {
  document.getElementById("phraseNumber").innerHTML = "Phrase " + (iterator + 1);
}

function updatePhrase() {
  document.getElementById("phraseToSay").innerHTML = '"' + phraseList[iterator] + '"';
}

document.getElementById("recordButton").onclick = function() {
  var words = phraseList[iterator].split(" ");
  var grammar = "#JSGF V1.0; grammar words; public <word> = " + words.join(' | ') + ' ;';
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 0.75);
  recognition.grammars = speechRecognitionList;
  recognition.start();
  document.getElementById("userSaid").innerHTML = "<em>Recording...</em>";
  document.getElementById("recordButton").disabled = true;
}

function myFunction(event) {
  console.log(event.results);
  var last = event.results.length - 1;
  var color = event.results[last][0].transcript;
  display(color);
  console.log('Confidence: ' + event.results[last][0].confidence);
}

// TODO this can be replaced by Google text synthesizer which is
// better but also costs money
document.getElementById("repeatButton").onclick = function() {
  //console.log(synth.getVoices());
  var utterThis = new SpeechSynthesisUtterance(phraseList[iterator]);
  var selectedOption = synth.getVoices()[0];
  utterThis.voice = selectedOption;
  utterThis.pitch = 1;
  utterThis.rate = 0.8;
  synth.speak(utterThis);
  //console.log("Voice synthesis")
  document.getElementById("repeatButton").disabled = true;
  utterThis.onend = function(event) {
    document.getElementById("repeatButton").disabled = false;
  }
}

function display(event) {
  userSaid.textContent = event;
  document.getElementById("recordButton").disabled = false;
  document.getElementById("nextPhrase").disabled = false;
}

recognition.onresult = function(event) {
  myFunction(event);
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
