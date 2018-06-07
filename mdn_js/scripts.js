var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var synth = window.speechSynthesis;
var phraseList = [ // TODO should ask the user
  "this does not require any further maintenance, for Bernard ensures it is operational",
  "the giraffe is very tall",
  "the lion roars",
  "the cat and dog are friends"
]
var completedPhrases = [];
var iterator = 0;
var toggle = 0;

updatePhrase();
updatePhraseNumber();

document.getElementById("nextPhrase").onclick = function() {
  iterator = iterator + 1;
  updatePhrase();
  updatePhraseNumber();
  if (completedPhrases.includes(iterator)) {
    document.getElementById("nextPhrase").disabled = false;
  } else {
    document.getElementById("nextPhrase").disabled = true;
  }
  document.getElementById("prevPhrase").disabled = false;
  document.getElementById("userSaid").innerHTML = "<em>Please repeat the phrase</em>";
  if (iterator == (phraseList.length-1)) {
    document.getElementById("nextPhrase").innerHTML = "Finish";
  } else {
    document.getElementById("nextPhrase").innerHTML = "Next";
  }
  checkIfFinished();
}

document.getElementById("prevPhrase").onclick = function() {
  iterator = iterator - 1;
  if (iterator == 0) {
    document.getElementById("prevPhrase").disabled = true;
  }
  updatePhrase();
  updatePhraseNumber();
  if (completedPhrases.includes(iterator)) {
    document.getElementById("nextPhrase").disabled = false;
  } else {
    document.getElementById("nextPhrase").disabled = true;
  }
  document.getElementById("userSaid").innerHTML = "<em>Please repeat the phrase</em>";
  if (iterator == (phraseList.length-1)) {
    document.getElementById("nextPhrase").innerHTML = "Finish";
  } else {
    document.getElementById("nextPhrase").innerHTML = "Next";
  }
}

function checkIfFinished() {
  if (iterator >= phraseList.length) {
    document.getElementById("phraseNumber").innerHTML = "";
    document.getElementById("mainBody").innerHTML = '<div class="card-body"></div>';
    document.getElementById("oldAreaB").innerHTML = '<button type="button" id="finishApp" class="btn btn-info btn-block">Finish</button>';
    document.getElementById("oldAreaA").innerHTML = "";
    document.getElementById("finishApp").onclick = function() {
      console.log("finished");
    }
  }
}

function updatePhraseNumber() {
  document.getElementById("phraseNumber").innerHTML = "Phrase " + (iterator + 1);
}

function updatePhrase() {
  document.getElementById("phraseToSay").innerHTML = '"' + phraseList[iterator] + '"';
}

document.getElementById("recordButton").onclick = function() {
  var phrase = phraseList[iterator];
  var grammar = "#JSGF V1.0; grammar phrase; public <phrase> = " + phrase + ";";
  var recognition = new SpeechRecognition(); // TODO ill this cause memory Leak?
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 30; // TODO alternative numbers available
  recognition.start();
  document.getElementById("userSaid").innerHTML = "<em>Recording...</em>";
  document.getElementById("recordButton").disabled = true;
  recognition.onresult = function(event) {
    toggle = 1;
    if (!completedPhrases.includes(iterator)) {
      completedPhrases.push(iterator);
    }
    console.log(completedPhrases);
    myFunction(event);
  }
  recognition.onspeechend = function() {
    recognition.stop();
  }
  recognition.onnomatch = function(event) {
    console.log("no match");
  }
  recognition.onerror = function(event) {
    console.log("error");
  }
  recognition.onaudiostart = function() {
    console.log('Audio capturing started'); // first
  }
  recognition.onend = function() {
    console.log('Speech recognition service disconnected'); // fifth
    // TODO sometimes if its bad we don't get a result
    // but this always marks the end of everything
    // so reenable the record button
    // don't grade if we didn't get anyhting good
    if (toggle == 0) {
      document.getElementById("recordButton").disabled = false;
      document.getElementById("userSaid").innerHTML = "<em>Please try again</em>";
    }
    toggle = 0;
  }
  recognition.onaudioend = function() {
    console.log('Audio capturing ended'); // fourth
  }
  recognition.onsoundend = function() {
    console.log('Sound has stopped being received'); // third
  }
  recognition.onsoundstart = function() {
    console.log('Some sound is being received'); // second
  }
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
  document.getElementById("repeatButton").disabled = true;
  utterThis.onend = function(event) {
    document.getElementById("repeatButton").disabled = false;
  }
}

function myFunction(event) {
  console.log(event.results);
  var last = event.results.length - 1;
  var transcript = event.results[last][0].transcript;
  receiveTranscript(transcript);
  var confidence = event.results[last][0].confidence;
  // TODO if confidence is 0.5, it's basically useless
  // 0 = 0.5x + y
  // 1 = 0.98x + y
  // TODO good confidence is around 0.95 so... y = 100/43x -55/43
  // harsher
  // easier below
  // 25/12 * confidence - 25/24
  //
  var multiplier = 1.107285 - (15.37018)*(Math.pow(Math.E,(-4.792245*confidence)));
  console.log("Confidence: " + confidence);
  console.log("Multiplier: " + multiplier);


  // transcript
  var numberOfAlternatives = event.results[last].length;
  console.log(numberOfAlternatives);

  var original = phraseList[iterator].toLowerCase().split(" ");
  var finalTranscript = transcript.toLowerCase().split(" ");

  var grade = 0;
  receiveGrade(grade);


  /*
  Things that will matter:
  - how many alternatives
  - how many words alternatives have
  - how close together are alternatives words to intended
  - how close alterantives words are to final results
  - how deviate are all alternative words in columns
  */
}

function receiveTranscript(event) {
  userSaid.textContent = event;
  document.getElementById("recordButton").disabled = false;
  document.getElementById("nextPhrase").disabled = false;
}

function receiveGrade(event) {
  console.log(event);
}

/*
0.55 0
0.7 0.6
0.85 0.8
0.91 0.9
0.98 1
basic exponential
y = 1.107285 - 15.37018e^(-4.792245x)
*/
