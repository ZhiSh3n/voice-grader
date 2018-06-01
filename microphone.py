import io
import os
from google.oauth2 import service_account
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
import speech_recognition as sr
r = sr.Recognizer()

credentials = service_account.Credentials.from_service_account_file('api-key.json')
client = speech.SpeechClient(credentials=credentials)

with io.open("resources/jackhammerm.flac", 'rb') as audio_file:
    print(type(audio_file))
    content = audio_file.read()
print(type(content))


harvard = sr.AudioFile('resources/jackhammerm.flac')
with harvard as source:
    print(type(source))
    r.adjust_for_ambient_noise(source, duration=0.25)
    audio = r.record(source)
print(type(audio))

"""
audio = types.RecognitionAudio(content=content)
config = types.RecognitionConfig(
    encoding=enums.RecognitionConfig.AudioEncoding.FLAC,
    sample_rate_hertz=44100,
    language_code='en-US',
    max_alternatives=30)

response = client.recognize(config, audio)
print(response.results)

"""


"""
import os
import speech_recognition as sr
r = sr.Recognizer()
"""

"""
print(sr.Microphone.list_microphone_names())
mic = sr.Microphone(device_index=0)
with mic as source:
    r.adjust_for_ambient_noise(source)
    audio = r.listen(source)
listg = r.recognize_google(audio, show_all=True)
print(listg)


with open("api-key.json") as f:
    GOOGLE_CLOUD_SPEECH_CREDENTIALS = f.read()

harvard = sr.AudioFile('jackhammer.wav')
with harvard as source:
    r.adjust_for_ambient_noise(source, duration=0.25)
    audio = r.record(source)

print(r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS, show_all=True));
"""

"""
harvard = sr.AudioFile('jackhammer.wav')
with harvard as source:
    r.adjust_for_ambient_noise(source, duration=0.25)
    audio = r.record(source)

myList = r.recognize_google(audio, language="en-GB", show_all=True)
#for key, value in myList.items():
print(myList['alternative'])
"""
