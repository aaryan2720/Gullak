import os
from dotenv import load_dotenv
load_dotenv()

print("GEMINI_API_KEY from env:", os.getenv("GEMINI_API_KEY")[:10] + "..." if os.getenv("GEMINI_API_KEY") else "None")

try:
    from google import genai
    client = genai.Client()
    print("Testing client.interactions.create with gemini-3.7-flash...")
    interaction = client.interactions.create(
        model="gemini-3.7-flash",
        input="Explain how AI works in a few words"
    )
    print("Output text:")
    print(interaction.output_text)
except Exception as e:
    print("Error occurred during test:", e)
