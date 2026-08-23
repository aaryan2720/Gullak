import os
import sys
from dotenv import load_dotenv

# Load env variables
load_dotenv()

def test_openai_connection():
    print("=========================================")
    print("Testing OpenAI API Connection...")
    print("=========================================")
    
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        print("[-] Error: OPENAI_API_KEY is not defined in backend/ai/.env file.")
        sys.exit(1)
        
    print(f"[*] Loaded API Key: {key[:15]}...{key[-10:]}")
    print("[*] Contacting OpenAI API (sending simple prompt: 'Say hello')...")
    
    try:
        from langchain_openai import ChatOpenAI
        
        # Initialize model with 5s timeout
        model = ChatOpenAI(
            model="gpt-4o",
            temperature=0.7,
            openai_api_key=key,
            timeout=5.0,
            max_retries=1
        )
        
        # Test model invocation
        res = model.invoke("Say hello and confirm you are online.")
        print("[+] Success! Connected to OpenAI API successfully.")
        print(f"[+] Response: {res.content}")
        sys.exit(0)
    except ImportError as ie:
        print(f"[-] Dependency Error: {str(ie)}")
        print("[*] Trying to fallback to direct openai package...")
        try:
            import openai
            client = openai.OpenAI(api_key=key)
            completion = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": "Say hello"}],
                timeout=5.0
            )
            print("[+] Success! Connected to OpenAI API successfully (via direct openai package).")
            print(f"[+] Response: {completion.choices[0].message.content}")
            sys.exit(0)
        except Exception as ex:
            print(f"[-] Fallback failed: {str(ex)}")
            sys.exit(1)
    except Exception as e:
        print("[-] OpenAI Connection Failed!")
        print(f"[-] Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_openai_connection()
