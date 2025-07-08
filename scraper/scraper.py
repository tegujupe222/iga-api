import json
import os

def load_config():
    with open(os.path.join(os.path.dirname(__file__), 'config.json')) as f:
        return json.load(f)

def main(park, type_):
    config = load_config()
    # 本来はここでスクレイピング
    print(f"[SCRAPER] park={park}, type={type_}")
    print(json.dumps({"park": park, "type": type_, "data": [
        {"name": "Sample Attraction", "info": "30min"}
    ]}))

def run_cron():
    print("[SCRAPER] Running in cron mode (ダミー)") 