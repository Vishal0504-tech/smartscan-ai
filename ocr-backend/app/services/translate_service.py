from googletrans import Translator

translator = Translator()

def translate_text(text, target):
    try:
        detected = translator.detect(text)
        translated = translator.translate(text, src=detected.lang, dest=target)
        return translated.text
    except:
        return "Translation failed"