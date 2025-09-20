from dotenv import load_dotenv
import os

# .env file load
load_dotenv()

# Key check
api_key = os.getenv("OPENROUTER_API_KEY")
print("API Key:", api_key)
