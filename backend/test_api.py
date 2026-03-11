
import requests
import json
import sys

def test_sessions(address):
    url = f"http://localhost:8000/ws/chat/sessions/{address}"
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(json.dumps(response.json(), indent=2))
        else:
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    addr = sys.argv[1] if len(sys.argv) > 1 else "ST34YG65NE0547H4GSNB00HKA2VGCWXDS5HJQ57C7"
    test_sessions(addr)
