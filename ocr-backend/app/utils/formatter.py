import re

def format_notes(text):
    lines = text.split("\n")

    formatted = []
    for line in lines:
        if re.match(r'^\d+', line):
            formatted.append(f"# {line}")
        elif "-" in line:
            formatted.append(f"- {line}")
        else:
            formatted.append(line)

    return "\n".join(formatted)