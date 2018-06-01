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

jackhammer = sr.AudioFile('jackhammer.wav')
with jackhammer as source:
    audio = r.record(source)

'''
print("");
print("Google: ");
print(r.recognize_google(audio));
# not very good results!

with jackhammer as source:
    r.adjust_for_ambient_noise(source, duration=0.5)
    audio = r.record(source)

print("");
print("Google: ");
print(r.recognize_google(audio));
# better results!

print("");
print("Google: ");
print(r.recognize_google(audio, show_all=True))
# show all results
'''

print("");
print("Google: ");
list = r.recognize_google(audio, show_all=True)
print(list)
    
# show all results with confidence
