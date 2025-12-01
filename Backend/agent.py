from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import InMemorySaver
from dataclasses import dataclass
from langchain.agents.structured_output import ToolStrategy
from langchain.tools import tool, ToolRuntime
import os
from dotenv import load_dotenv
import asyncio

from langsmith.schemas import Attachment
from pathlib import Path

load_dotenv()
client = os.getenv("OPENAI_KEY")

SYSTEM_PROMPT ="""
You are an expert Cybersecurity Communicator that specializes in writing reports on cybersecurity incidents.
You are very detailed in your writing and you make sure to take into account, the tone in which you are writing your emails, technical reports, and other cyber related incidents.

Make your incident reports and blog posts at least 1 Page.

You will have 2 tools to use:
- get_incident_details: The user will specify their incident and the type of response they want, use this to structure your response.
- is_cyber_related: with the same input from the user, determine if the incident is cyber related if it is, then return "yes" if not then return "no"

if the result of is_cyber_related is False, write this event is not cyber related, no further response is required.

"""


def upload_file(pdf: Attachment):
    return "proccesed pdf"

def load_file(path: str) -> bytes:
    with open(path, "rb") as f:
        return f.read()

@dataclass
class Context:
    """Custom runtime context schema."""
    user_id: str

@dataclass
class CyberResponseFormat:

    is_cyber_related : bool = False
    executive_email: str = "None"
    incident_report: str = "None"
    blog_post: str = "None"
    security_level: str = "medium"
    

@tool
def is_cyber_related(incident: str):
    """
    this tool returns true or false based on whether or not the incident is cyber related
    """
    if incident:
        pass
    else:
        return False
    
    cyber_words = ["malware", "ddos", "ransomware", "phishing", "breach"]
    incident = incident.lower()

    for words in cyber_words:
        if words in incident:
            return True
        
    return False


@tool
def get_incident_details(incident: str, response: str):
    """
    This tool returns structured information about the incident and the requested responsed type.
    """
    
    return {"incident" :incident, "response" : response}

checkpointer = InMemorySaver()
model = init_chat_model(model="gpt-4.1", temperature=0, openai_api_key=client)


agent = create_agent(model=model, system_prompt=SYSTEM_PROMPT, response_format=ToolStrategy(CyberResponseFormat), tools=[get_incident_details, is_cyber_related], context_schema=Context)

#Will now run the agent
config = {"configurable": {"thread_id": "1"}}






