from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import numpy as np
import json
import nltk
from nltk.stem.porter import PorterStemmer
from flask_cors import CORS



nltk.download('punkt')

stemmer = PorterStemmer()

app = Flask(__name__)
CORS(app)

def tokenize(sentence):
    return nltk.word_tokenize(sentence)


def stem(word):
    return stemmer.stem(word.lower())


def bag_of_words(tokenized_sentence, all_words):
    sentence_words = [stem(word) for word in tokenized_sentence]
    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in sentence_words:
            bag[idx] = 1.0
    return bag


class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out)
        return out


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
with open('intents.json', 'r', encoding='utf-8') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()


@app.route('/chat', methods=['POST'])
def chat():
    data_req = request.get_json()
    sentence = data_req["message"]

    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.7:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                # Nối tất cả các câu trả lời trong responses thành một chuỗi
                response_text = " ".join(intent['responses'])  # Sử dụng khoảng trắng làm phân cách
                return jsonify({
                    "tag": tag,
                    # "response": np.random.choice(intent['responses']),
                    "response": response_text,
                    "emergency": intent.get("emergency", False)
                })
    else:
        return jsonify({
            "tag": "unknown",
            "response": "Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi lại?",
            "emergency": False
        })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
