
#form audio file
import speech_recognizer as sr
filename="speech.wav"
r=sr.Recognizer()
with sr.AudioFile(filename) as source:
	audio_data = r.record(source)
	text=r.recognize_google(audio_data)
	print(text)

#live audio

import speech_recognizer as sr
filename="speech.wav"
r=sr.Recognizer()
print("plz talk")
with sr.Microphone() as source:
	audio_data=r.record(source,duration=5)
	print("Recognizing")
	text=r.recognize_google(audio_data)
	print(text)