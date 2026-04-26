import json

with open('app/src/data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Fix Q14
for q in questions:
    if q['id'] == 14:
        q['options'] = [
            "Passanten auf der Straße beschimpfen darf.",
            "meine Meinung im Internet äußern kann.",
            "Nazi-, Hamas- oder Islamischer Staat-Symbole öffentlich tragen darf.",
            "meine Meinung nur dann äußern darf, solange ich der Regierung nicht widerspreche."
        ]
    elif q['id'] == 70:
        q['text'] = q['text'].replace("© Bundesregierung/Engelbert Reineke", "").strip()

# Apply answers 1-100
answers_str = "4212241234144221411413431223222212214212122211132231441242424224414424441314434344333121313442241211"
for i, char in enumerate(answers_str):
    q_id = i + 1
    for q in questions:
        if q['id'] == q_id:
            q['correctAnswer'] = int(char) - 1
            break

with open('app/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Updated questions.json")
