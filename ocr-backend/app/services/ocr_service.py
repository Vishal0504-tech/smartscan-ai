from paddleocr import PaddleOCR

ocr_en = PaddleOCR(lang='en')
ocr_ta = PaddleOCR(lang='ta')

def extract_text(image, lang="en"):
    if lang == "ta":
        ocr = ocr_ta
    else:
        ocr = ocr_en

    result = ocr.ocr(image)

    texts = []
    for line in result:
        for word_info in line:
            text = word_info[1][0]
            confidence = word_info[1][1]

            if confidence > 0.5:
                texts.append(text)

    return " ".join(texts)