import cv2
import numpy as np

def preprocess_image(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 🔍 Resize (improves OCR)
    img = cv2.resize(img, None, fx=1.3, fy=1.3)

    # 🧠 Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 🧹 Noise removal
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # invert (important for white text on black)
    gray = cv2.bitwise_not(gray)


    # 📄 Adaptive threshold (BEST for paper scan)
    thresh = cv2.adaptiveThreshold(
        gray, 255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY,
    11, 2
    )

    return thresh