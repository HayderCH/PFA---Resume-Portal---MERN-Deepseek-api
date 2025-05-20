import re
import json
import os
from typing import Any, List, Optional

class JSONExtractor:
    """
    Extracts JSON code blocks from a text string and writes each as a separate .json file.

    It looks for any occurrence of a Markdown JSON code fence:
    ```json
    { ... }
    ```

    Filenames can be:
      1. Forced: a single user-provided base name for all JSON blocks.
      2. Derived from JSON top-level keys (if enabled and valid).
      3. Sequential: json_block_1, json_block_2, ...

    All filenames are sanitized and made unique (appending _1, _2, ... if needed).
    """

    def __init__(
        self,
        output_dir: str = '.',
        use_top_key_names: bool = True,
        forced_name: Optional[str] = None
    ):
        """
        Args:
            output_dir (str): Directory where JSON files will be saved.
            use_top_key_names (bool): If True, and the JSON object has a single top-level key,
                use that key as the base filename when forced_name is None.
            forced_name (str, optional): If provided, every JSON block will use this as the base filename.
        """
        self.output_dir = output_dir
        self.use_top_key_names = use_top_key_names
        self.forced_name = forced_name
        os.makedirs(self.output_dir, exist_ok=True)

    def extract_blocks(self, text: str) -> List[str]:
        """
        Extract all JSON blocks from the text.

        Args:
            text (str): Input text containing ```json ... ``` blocks.

        Returns:
            List of JSON string blocks (raw text including braces).
        """
        pattern = re.compile(r"```json\s*(\{.*?\})\s*```", re.DOTALL)
        return pattern.findall(text)

    def parse_blocks(self, blocks: List[str]) -> List[Any]:
        """
        Parse each JSON string block into Python objects.
        Invalid JSON blocks will raise JSONDecodeError.
        """
        return [json.loads(block) for block in blocks]

    def _sanitize(self, name: str) -> str:
        """
        Sanitize a base name to a filesystem-safe string.
        """
        clean = name.strip().lower()
        clean = re.sub(r"[^\w\-]", "_", clean)
        return clean

    def _unique_filename(self, base: str) -> str:
        """
        Generate a unique filename (with .json) in the output directory,
        appending an incrementing suffix if needed.
        """
        safe_base = self._sanitize(base)
        filename = f"{safe_base}.json"
        path = os.path.join(self.output_dir, filename)
        counter = 1
        while os.path.exists(path):
            filename = f"{safe_base}_{counter}.json"
            path = os.path.join(self.output_dir, filename)
            counter += 1
        return filename

    def save_blocks(self, data_list: List[Any]) -> None:
        """
        Save each parsed JSON object to a file.

        Filenames are determined in order of priority:
          1. forced_name (applied to every block)
          2. single top-level key (if use_top_key_names is True)
          3. sequential naming json_block_{index+1}

        All filenames are sanitized and made unique.
        """
        for idx, data in enumerate(data_list):
            # Determine base name
            if self.forced_name:
                base = self.forced_name
            else:
                base = None
                if self.use_top_key_names and isinstance(data, dict) and len(data) == 1:
                    base = next(iter(data.keys()))
                if not base:
                    base = f"json_block_{idx+1}"

            filename = self._unique_filename(base)
            file_path = os.path.join(self.output_dir, filename)

            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Saved JSON to {file_path}")

    def extract_and_save(self, text: str) -> None:
        """
        Full pipeline: extract raw blocks, parse them, and save to files.

        Args:
            text (str): Input text containing JSON blocks.
        """
        blocks = self.extract_blocks(text)
        if not blocks:
            print("No JSON blocks found.")
            return

        try:
            parsed = self.parse_blocks(blocks)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return

        self.save_blocks(parsed)

# Example usage:
# if __name__ == '__main__':
#     text = get_your_extracted_text()
#     # Force all JSON to use "hello" as base filename
#     extractor = JSONExtractor(output_dir='.', use_top_key_names=True, forced_name='hello')
#     extractor.extract_and_save(text)