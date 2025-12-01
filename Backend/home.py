from flask import Flask, request, jsonify
import os
from flask_cors import CORS
app = Flask(__name__)


from agent import agent, Context

CORS(app)


@app.route("/")
def welcome():
    return "Backend loaded"

@app.route("/cyber-chat", methods=['POST'])
def cyber_response():
    try:
        data = request.get_json()
        incident = data.get("Incident", "")
        response_type = data.get("Response", "")
        user_id = data.get("user_id", "1")

        response = agent.invoke(
                {"messages": [{"role": "user", "content": f"{incident}. Please write a {response_type}."}]},
                config={"configurable": {"thread_id": "1"}},
                context=Context(user_id=user_id)
        )



        structured = response["structured_response"]
        return jsonify(structured.__dict__)

    except Exception as e:
        return jsonify({"error": str(e)})

