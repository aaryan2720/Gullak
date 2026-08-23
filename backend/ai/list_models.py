import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def list_available_models():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        print("[-] Error: OPENAI_API_KEY is not defined in .env")
        sys.exit(1)
        
    client = OpenAI(api_key=key)
    try:
        print("[*] Retrieving models list from OpenAI...")
        models = client.models.list()
        model_ids = [m.id for m in models.data]
        print(f"[+] Successfully retrieved {len(model_ids)} models!")
        print("[*] Top available models:")
        for mid in sorted(model_ids)[:15]:
            print(f"  - {mid}")
            
        # Test a cheap model next
        print("\n[*] Trying cheap model (gpt-4o-mini)...")
        try:
            res = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": "Say hi"}],
                timeout=5.0
            )
            print(f"[+] Success! gpt-4o-mini is working! Response: {res.choices[0].message.content}")
        except Exception as e:
            print(f"[-] gpt-4o-mini failed: {str(e)}")
            
        print("\n[*] Trying old model (gpt-3.5-turbo)...")
        try:
            res = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Say hi"}],
                timeout=5.0
            )
            print(f"[+] Success! gpt-3.5-turbo is working! Response: {res.choices[0].message.content}")
        except Exception as e:
            print(f"[-] gpt-3.5-turbo failed: {str(e)}")
            
    except Exception as err:
        print(f"[-] Failed to retrieve models: {str(err)}")

if __name__ == "__main__":
    list_available_models()
