import fitz
import json
import re

pdf_path = 'gesamtfragenkatalog-lebenindeutschland.pdf'
doc = fitz.open(pdf_path)

questions = []
current_question = None
current_option_index = -1

checkbox_chars = ['', '□', 'o', chr(61602), '\uf0a3']

for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text = page.get_text("text")
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Check for new question "Aufgabe X"
        m = re.match(r'^Aufgabe\s+(\d+)', line)
        if m:
            if current_question:
                questions.append(current_question)
            current_question = {
                'id': int(m.group(1)),
                'text': '',
                'options': [],
                'image': None,
                'correctAnswer': 0
            }
            current_option_index = -1
            continue
        
        if current_question:
            # Check if this line is a checkbox or starts with one
            is_checkbox = False
            for char in checkbox_chars:
                if line.startswith(char):
                    is_checkbox = True
                    option_text = line[len(char):].strip()
                    current_question['options'].append(option_text)
                    current_option_index = len(current_question['options']) - 1
                    break
            
            if not is_checkbox:
                # Avoid pagination info
                if re.match(r'^Seite\s+\d+\s+von\s+\d+', line): continue
                if line.startswith("Teil I") or line.startswith("Allgemeine Fragen") or line.startswith("Fragen für das Bundesland") or line.startswith("Teil II"): continue
                
                # If we have started seeing options, this line belongs to the current option
                if current_option_index >= 0:
                    if current_question['options'][current_option_index]:
                        current_question['options'][current_option_index] += ' ' + line
                    else:
                        current_question['options'][current_option_index] = line
                else:
                    # Belongs to question text
                    current_question['text'] += line + ' '

if current_question:
    questions.append(current_question)

for q in questions:
    q['text'] = q['text'].strip()
    for i in range(len(q['options'])):
        q['options'][i] = q['options'][i].strip()

with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Successfully extracted {len(questions)} questions.")
