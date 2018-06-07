
fetch('http://example.com/movies.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });

/*
curl -X POST -u {username}:{password}
--header "Content-Type: audio/flac"
--data-binary @{path}audio-file.flac
"https://stream.watsonplatform.net/speech-to-text/api/v1/recognize"
*/

/*
document.getElementById('submitMultiPartBtn').addEventListener("click", myFunction);

function myFunction() {
    console.log("hi");
    var request = new XMLHttpRequest();
    function reqStateChange() {
        if (request.readyState == 4 || request.readyState == 3) {
            console.log(request.status + " " + request.statusText);
            console.log(request.responseText);
        }
    }
    frm=document.forms['RequestForm']
    var s = JSON.parse(frm.elements['RequestData'].value);
    formData = new FormData();
    formData.append('jsonDescription',JSON.stringify(s));
    fileArr=frm.filesToUpload.files
            for (var x = 0; x < fileArr.length; x++) {
              formData.append(fileArr[x].name,fileArr[x]);
            }
    request.onreadystatechange = reqStateChange;
    request.open('POST', 'https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/text-to-speech/api', true);
    request.setRequestHeader('Authorization', 'Basic ' + btoa('02b534ea-bf77-47c6-af13-089eee8e6450:24shYn3aKWaB'));
    request.send(formData);
}

*/


/*
02b534ea-bf77-47c6-af13-089eee8e6450
24shYn3aKWaB
https://stream.watsonplatform.net/speech-to-text/api
*/
