import io
import os
import sys
import subprocess
import wave
import aifc
import math
import audioop
import collections
import json
import base64
import threading
import platform
import stat
import hashlib
import hmac
import time
import uuid
import speech_recognition as sr


r = sr.Recognizer()

print(sr.Microphone.list_microphone_names())
mic = sr.Microphone(device_index=0)
with mic as source:
    r.adjust_for_ambient_noise(source)
    audio = r.listen(source)

"""
harvard = sr.AudioFile('../resources/jackhammer.wav')
with harvard as source:
    r.adjust_for_ambient_noise(source, duration=0.25)
    audio = r.record(source)
"""

with open("../api-key.json") as f:
    GOOGLE_CLOUD_SPEECH_CREDENTIALS = f.read()

#print(r.recognize_google(audio, show_all=True))
#print(r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS, show_all=True))


json.loads(GOOGLE_CLOUD_SPEECH_CREDENTIALS)

flac_data = audio.get_flac_data(
        convert_rate=None if 8000 <= audio.sample_rate <= 48000 else max(8000, min(audio.sample_rate, 48000)),  # audio sample rate must be between 8 kHz and 48 kHz inclusive - clamp sample rate into this range
        convert_width=2  # audio samples must be 16-bit
)

from oauth2client.client import GoogleCredentials
from googleapiclient.discovery import build
import googleapiclient.errors

with sr.PortableNamedTemporaryFile("w") as f:
        f.write(GOOGLE_CLOUD_SPEECH_CREDENTIALS)
        f.flush()
        api_credentials = GoogleCredentials.from_stream(f.name)

speech_service = build("speech", "v1", credentials=api_credentials, cache_discovery=False)
speech_config = {"encoding": "FLAC", "sampleRateHertz": audio.sample_rate, "languageCode": "en-GB", "maxAlternatives": 10}
speech_config["enableWordTimeOffsets"] = True
request = speech_service.speech().recognize(body={"audio": {"content": base64.b64encode(flac_data).decode("utf8")}, "config": speech_config})
response = request.execute()
print(response)

