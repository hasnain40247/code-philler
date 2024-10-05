from flask import Flask, request, jsonify
import logging
import ssl
from threading import Thread
from mlx_lm import load, generate

# Setup logging
logging.basicConfig(level=logging.INFO)

# Initialize Flask App
app = Flask(__name__)

# Model settings
model_path = "./fused_model"

# Load the model and tokenizer
model, tokenizer = load(model_path)

@app.route('/api/v1/generate', methods=['POST'])
def generate_text():
    """
    API endpoint to generate autocompleted code based on a provided prompt.
    
    Expects JSON input with fields:
    - 'prompt': the code snippet or text to autocomplete.
    - 'max_new_tokens': the maximum number of new tokens to generate (default: 80).
    
    Returns a JSON response with the generated text.
    """
    data = request.get_json()

    prompt_text = data.get('prompt', '')
    max_new_tokens = data.get('max_new_tokens', 80)

    chat = [
        {"content": "You are a code autocomplete agent. Users will input partial code snippets, and you will autocomplete the code based on the provided snippet.", "role": "system"},
        {"content": prompt_text, "role": "user"},
        {"content": "", "role": "assistant"}
    ]

    prompt = tokenizer.apply_chat_template(chat, add_generation_prompt=True, tokenize=False)
  
    response = generate(model, tokenizer, prompt=prompt, max_tokens=50)
    cleaned_response = response.replace("<code>", "").replace("</code>", "").replace("<|end|>", "").replace("<|assistant|>", "").strip()

    return jsonify({'results': [{'text': cleaned_response}]})

def start_ssl_server(app, port):
    """
    Start the Flask app with SSL support.
    
    Args:
    - app: The Flask app instance.
    - port: Port number to run the server on.
    
    Loads the SSL certificate and key from 'cert.pem' and 'key.pem' files.
    """
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile='cert.pem', keyfile='key.pem')
    app.run(host='0.0.0.0', port=port, ssl_context=context)

def start_server(port: int, use_ssl: bool = False):
    """
    Start the Flask app server.
    
    Args:
    - port: Port number to run the server on.
    - use_ssl: Boolean indicating whether to use SSL (default: False).
    
    If SSL is enabled, starts the server on a separate thread.
    """
    if use_ssl:
        Thread(target=start_ssl_server, args=(app, port)).start()
    else:
        app.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    start_server(3000, use_ssl=False)
