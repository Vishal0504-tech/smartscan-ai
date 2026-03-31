from paddleocr import PaddleOCR

# Load once (important)
ocr_en = PaddleOCR(use_angle_cls=True, lang='en')
ocr_ta = PaddleOCR(use_angle_cls=True, lang='ta')

def extract_text(image, lang="en"):
    ocr = ocr_ta if lang == "ta" else ocr_en

    result = ocr.ocr(image, cls=True)

    texts = []
    for line in result:
        for word_info in line:
            text = word_info[1][0]
            confidence = word_info[1][1]

            if confidence > 0.5:
                texts.append(text)

    return " ".join(texts)