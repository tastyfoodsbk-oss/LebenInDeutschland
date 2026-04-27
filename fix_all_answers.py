import json

with open('app/src/data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Apply answers 1-310
answers_str = "4213341234134221411413431223222313214242122211132231441242424224414434441314434344333121313442241211212444222342123434331133213131322142332112121424322342331112143314443144322324232321124434213121132322221233422331214244143242234143143422232311422222411434222421114414332442444133222241323213312341214332241443"

for i, char in enumerate(answers_str):
    q_id = i + 1
    for q in questions:
        if q['id'] == q_id:
            q['correctAnswer'] = int(char) - 1
            break

with open('app/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Updated {len(answers_str)} answers in questions.json")
