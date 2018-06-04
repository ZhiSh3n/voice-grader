function myFunction(event) {
  console.log(event.results);
  var last = event.results.length - 1;
  var color = event.results[last][0].transcript;
  display(color);
  console.log('Confidence: ' + event.results[last][0].confidence);
}
