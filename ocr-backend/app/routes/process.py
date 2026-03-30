from fastapi import APIRouter, UploadFile, File, Form
from app.services.ocr_service import extract_text
from app.services.translate_service import translate_text
from app.services.preprocess import preprocess_image
from app.utils.formatter import format_notes
from app.utils.ticket_parser import extract_ticket_info
import numpy as np
import cv2
router = APIRouter()

@router.post("/process")
async def process_image(
    file: UploadFile = File(...),
    mode: str = Form(...),
    targetLang: str = Form("en"),
    ocrLang: str = Form("en")   # 👈 NEW
):
    contents = await file.read()

    # 🔄 Convert to OpenCV image
    np_arr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    

    image = preprocess_image(contents)

    text = extract_text(image, ocrLang)

    if mode == "translate":
        translated = translate_text(text, targetLang)
        return {
            "original": text,
            "translated": translated
        }

    elif mode == "notes":
        formatted = format_notes(text)
        return {"formatted": formatted}

    elif mode == "ticket":
        data = extract_ticket_info(text)
        return {"ticket": data}

    return {"text": text}