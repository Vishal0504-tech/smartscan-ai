import re

def extract_ticket_info(text):
    data = {}

    date_match = re.search(r'\d{2}/\d{2}/\d{4}', text)
    if date_match:
        data["date"] = date_match.group()

    seat_match = re.search(r'Seat\s?\d+', text)
    if seat_match:
        data["seat"] = seat_match.group()

    data["raw"] = text

    return data