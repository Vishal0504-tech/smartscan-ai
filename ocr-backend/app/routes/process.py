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
    mode: str = Form("general"),
    targetLang: str = Form("en"),
    ocrLang: str = Form("en")
):
    contents = await file.read()

    # ✅ Use preprocess directly (handles decoding internally)
    image = preprocess_image(contents)

    # 🧠 OCR
    text = extract_text(image, ocrLang)

    # 🔁 Response handling
    if mode == "translate":
        translated = translate_text(text, targetLang)
        return {
            "mode": mode,
            "original": text,
            "translated": translated
        }

    elif mode == "notes":
        formatted = format_notes(text)
        return {
            "mode": mode,
            "formatted": formatted
        }

    elif mode == "ticket":
        data = extract_ticket_info(text)
        return {
            "mode": mode,
            "ticket": data
        }

    elif mode == "medical":
        return {
            "mode": mode,
            "medical": {
                "raw_text": text,
                "note": "Enhance with AI later"
            }
        }

    return {
        "mode": "general",
        "text": text
    }