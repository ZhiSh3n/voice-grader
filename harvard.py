import speech_recognition as sr

print("Speech Recognition Version: " + sr.__version__)

r = sr.Recognizer()

# recognize_bing()
# recognize_google()
# recognize_google_cloud()
#   requires installation of google-cloud-speech package
# recognize_houndify()
# recognize_ibm()
# recognize_sphinx()
#   requires PocketSphinx
# recognize_wit()

harvard = sr.AudioFile('harvard.wav')
with harvard as source:
    audio = r.record(source)

print("");
print("Google: ");
print(r.recognize_google(audio));
