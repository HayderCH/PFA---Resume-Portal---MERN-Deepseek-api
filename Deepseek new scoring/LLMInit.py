import os
import json
import base64
import tiktoken
from openai import OpenAI
from typing import List, Optional, Dict
from imageTotext import ImageToTextConverter

# Optional dependencies for file parsing
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None
try:
    import docx
except ImportError:
    docx = None

converter = ImageToTextConverter()

class OpenRouterChatClient:
    def __init__(
        self,
        api_key: str = "#place holder here#",
        model: str = "deepseek/deepseek-chat-v3-0324:free",
        memory_file: str = "chat_memory.json",
        max_history_tokens: int = 3000,
        context_token_limit: int = 163840,
        transform: str = "middle-out"
    ):
        """
        Implements chat with OpenRouter via the OpenAI client.

        transform: pass-through to OpenRouter for auto-compression (e.g., "middle-out").
        """
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("API key required")
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.api_key
        )
        self.model = model
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        self.memory_file = memory_file
        self.max_history_tokens = max_history_tokens
        self.context_token_limit = context_token_limit
        self.transform = transform

        # Load or initialize memory
        if os.path.exists(self.memory_file):
            with open(self.memory_file, 'r', encoding='utf-8') as f:
                self.memory = json.load(f)
        else:
            self.memory = {"summary": "", "history": []}

    def _count_tokens(self, text: str) -> int:
        return len(self.tokenizer.encode(text))

    def _prune_history(self):
        total = sum(self._count_tokens(m['content']) for m in self.memory['history'])
        if total <= self.max_history_tokens:
            return
        half = len(self.memory['history']) // 2
        to_summarize = self.memory['history'][:half]
        prompt = (
            "Summarize for future context:\n" +
            "\n".join(f"{m['role']}: {m['content']}" for m in to_summarize)
        )
        summary = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": prompt}]
        ).choices[0].message.content.strip()
        self.memory['summary'] += "\n" + summary
        self.memory['history'] = self.memory['history'][half:]
        self._save_memory()

    def _save_memory(self):
        with open(self.memory_file, 'w', encoding='utf-8') as f:
            json.dump(self.memory, f, ensure_ascii=False, indent=2)

    def import_file(self, path: str) -> str:
        ext = os.path.splitext(path)[1].lower()
        if ext in ['.txt', '.md']:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        elif ext == '.pdf':
            if not PyPDF2:
                raise ImportError("Install PyPDF2 to parse PDFs.")
            reader = PyPDF2.PdfReader(path)
            return "\n".join(p.extract_text() or '' for p in reader.pages)
        elif ext == '.docx':
            if not docx:
                raise ImportError("Install python-docx to parse DOCX.")
            document = docx.Document(path)
            return "\n".join(p.text for p in document.paragraphs)
        else:
            with open(path, 'rb') as f:
                b64 = base64.b64encode(f.read()).decode()
            return f"<BASE64 {os.path.basename(path)}>\n{b64}"

    def chat(
        self,
        prompt: str,
        text_files: Optional[List[str]] = None,
        image_files: Optional[List[str]] = None
    ) -> str:
        messages: List[Dict[str,str]] = []
        # Memory summary
        if self.memory['summary']:
            messages.append({"role": "system", "content": f"Memory Summary:\n{self.memory['summary']}"})
        # History
        messages.extend(self.memory['history'])

        # Attach files
        if text_files:
            for file in text_files:
                raw = self.import_file(file)
                # If raw too big, rely on transform
                messages.append({"role": "user", "content": f"<FILE {os.path.basename(file)}>\n{raw}"})
        if image_files:
            for file in image_files:

                text = converter.extract_text_from_image(file)
                
                messages.append({"role": "user", "content": f"<IMAGE {text}>\n{text}"})

        # Prompt
        messages.append({"role": "user", "content": prompt})

        # API call with transform
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            extra_body={"transform": self.transform}
        )

        print(resp)
        reply = resp.choices[0].message.content

        # Update memory
        self.memory['history'].append({"role": "user", "content": prompt})
        self.memory['history'].append({"role": "assistant", "content": reply})
        self._prune_history()
        self._save_memory()

        return reply

# Example:
# client = OpenRouterChatClient(api_key="YOUR_KEY")
# print(client.chat("Analyze this doc", text_files=["report.pdf"]))
