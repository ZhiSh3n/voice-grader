/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        /*
        var recordButton = document.getElementById('recordButton');
        recordButton.addEventListener('click', this.saySomething);
        var stopButton = document.getElementById('stopButton');
        //stopButton.addEventListener('click', helloWorld);
        */

        if (window.cordova && window.cordova.file && window.audioinput) {
            initUIEvents();
            consoleMessage("Use 'Start Capture' to begin...");
            // Subscribe to audioinput events
            //
            window.addEventListener('audioinput', onAudioInputCapture, false);
            window.addEventListener('audioinputerror', onAudioInputError, false);
        }
        else {
            consoleMessage("Missing: cordova-plugin-file or cordova-plugin-audioinput!");
            disableAllButtons();
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // get the id=deviceready and change up some elements in it
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    },

    saySomething: function() {
        console.log("hello!");
    }

};

app.initialize();

var captureCfg = {};

// Audio Buffer
var audioDataBuffer = [];

// Timers
var timerInterVal, timerGenerateSimulatedData;

var objectURL = null;

// Info/Debug
var totalReceivedData = 0;

// URL shim
window.URL = window.URL || window.webkitURL;

var initUIEvents = function () {
    document.getElementById("recordButton").addEventListener("click", startCapture);
    document.getElementById("stopButton").addEventListener("click", stopCapture);
};

var stopCapture = function () {
    try {
        if (window.audioinput && audioinput.isCapturing()) {

            if (timerInterVal) {
                clearInterval(timerInterVal);
            }

            if (isMobile.any() && window.audioinput) {
                audioinput.stop();
            }
            else {
                clearInterval(timerGenerateSimulatedData);
            }

            totalReceivedData = 0;
            document.getElementById("infoTimer").innerHTML = "";

            consoleMessage("Encoding WAV...");
            var encoder = new WavAudioEncoder(captureCfg.sampleRate, captureCfg.channels);
            encoder.encode([audioDataBuffer]);

            consoleMessage("Encoding WAV finished");

            var blob = encoder.finish("audio/wav");
            consoleMessage("BLOB created");

            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
                var fileName = new Date().YYYYMMDDHHMMSS() + ".wav";
                dir.getFile(fileName, {create: true}, function (file) {
                    file.createWriter(function (fileWriter) {
                        fileWriter.write(blob);

                        // Add an URL for the file
                        var a = document.createElement('a');
                        var linkText = document.createTextNode(file.toURL());
                        a.appendChild(linkText);
                        a.title = file.toURL();
                        a.href = file.toURL();
                        a.target = '_blank';
                        document.getElementById("recording-list").appendChild(a);

                        consoleMessage("File created!");
                    }, function () {
                        alert("FileWriter error!");
                    });
                });
            });

            disableStopButton();
        }
    }
    catch (e) {
        alert("stopCapture exception: " + e);
    }
};

var startCapture = function () {
    try {
        if (window.audioinput && !audioinput.isCapturing()) {
            var audioSourceElement = document.getElementById("audioSource"),
                audioSourceType = audioSourceElement.options[audioSourceElement.selectedIndex].value;

            captureCfg = {
                sampleRate: parseInt(document.getElementById('sampleRate').value),
                bufferSize: parseInt(document.getElementById('bufferSize').value),
                channels: parseInt(document.querySelector('input[name="channels"]:checked').value),
                format: document.querySelector('input[name="format"]:checked').value,
                audioSourceType: parseInt(audioSourceType)
            };

            audioinput.start(captureCfg);
            consoleMessage("Microphone input started!");

            // Throw previously created audio
            document.getElementById("recording-list").innerHTML = "";
            if (objectURL) {
                URL.revokeObjectURL(objectURL);
            }

            // Start the Interval that outputs time and debug data while capturing
            //
            timerInterVal = setInterval(function () {
                if (audioinput.isCapturing()) {
                    document.getElementById("infoTimer").innerHTML = "" +
                        new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") +
                        "|Received:" + totalReceivedData;
                }
            }, 1000);

            disableStartButton();
        }
    }
    catch (e) {
        alert("startCapture exception: " + e);
    }
};

function onAudioInputError(error) {
    alert("onAudioInputError event recieved: " + JSON.stringify(error));
}

function onAudioInputCapture(evt) {
    try {
        if (evt && evt.data) {
            // Increase the debug counter for received data
            totalReceivedData += evt.data.length;

            // Add the chunk to the buffer
            audioDataBuffer = audioDataBuffer.concat(evt.data);
        }
    }
    catch (ex) {
        alert("onAudioInputCapture ex: " + ex);
    }
}
