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
listg = r.recognize_google(audio, show_all=True)
print(listg)


with open("api-key.json") as f:
    GOOGLE_CLOUD_SPEECH_CREDENTIALS = f.read()

harvard = sr.AudioFile('resources/jackhammer.wav')
with harvard as source:
    r.adjust_for_ambient_noise(source, duration=0.25)
    audio = r.record(source)

print(r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS));




# edit from here
def recognize_google_cloud(self, audio_data, credentials_json=None, language="en-US", preferred_phrases=None, show_all=False):
        
        assert isinstance(audio_data, AudioData), "``audio_data`` must be audio data"
        if credentials_json is not None:
            try: json.loads(credentials_json)
            except Exception: raise AssertionError("``credentials_json`` must be ``None`` or a valid JSON string")
        assert isinstance(language, str), "``language`` must be a string"
        assert preferred_phrases is None or all(isinstance(preferred_phrases, (type(""), type(u""))) for preferred_phrases in preferred_phrases), "``preferred_phrases`` must be a list of strings"

        # See https://cloud.google.com/speech/reference/rest/v1/RecognitionConfig
        flac_data = audio_data.get_flac_data(
            convert_rate=None if 8000 <= audio_data.sample_rate <= 48000 else max(8000, min(audio_data.sample_rate, 48000)),  # audio sample rate must be between 8 kHz and 48 kHz inclusive - clamp sample rate into this range
            convert_width=2  # audio samples must be 16-bit
        )

        try:
            from oauth2client.client import GoogleCredentials
            from googleapiclient.discovery import build
            import googleapiclient.errors

            # cannot simply use 'http = httplib2.Http(timeout=self.operation_timeout)'
            # because discovery.build() says 'Arguments http and credentials are mutually exclusive'
            import socket
            import googleapiclient.http
            if self.operation_timeout and socket.getdefaulttimeout() is None:
                # override constant (used by googleapiclient.http.build_http())
                googleapiclient.http.DEFAULT_HTTP_TIMEOUT_SEC = self.operation_timeout

            if credentials_json is None:
                api_credentials = GoogleCredentials.get_application_default()
            else:
                # the credentials can only be read from a file, so we'll make a temp file and write in the contents to work around that
                with PortableNamedTemporaryFile("w") as f:
                    f.write(credentials_json)
                    f.flush()
                    api_credentials = GoogleCredentials.from_stream(f.name)

            speech_service = build("speech", "v1", credentials=api_credentials, cache_discovery=False)
        except ImportError:
            raise RequestError("missing google-api-python-client module: ensure that google-api-python-client is set up correctly.")

        speech_config = {"encoding": "FLAC", "sampleRateHertz": audio_data.sample_rate, "languageCode": language}
        if preferred_phrases is not None:
            speech_config["speechContext"] = {"phrases": preferred_phrases}
        if show_all:
            speech_config["enableWordTimeOffsets"] = True  # some useful extra options for when we want all the output
        request = speech_service.speech().recognize(body={"audio": {"content": base64.b64encode(flac_data).decode("utf8")}, "config": speech_config})

        try:
            response = request.execute()
        except googleapiclient.errors.HttpError as e:
            raise RequestError(e)
        except URLError as e:
            raise RequestError("recognition connection failed: {0}".format(e.reason))

        if show_all: return response
        if "results" not in response or len(response["results"]) == 0: raise UnknownValueError()
        transcript = ""
        for result in response["results"]:
            transcript += result["alternatives"][0]["transcript"].strip() + " "

        return transcript


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

