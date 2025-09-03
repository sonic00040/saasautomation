import requests
import sys

def set_webhook(bot_token, ngrok_url):
    """Sets the webhook for a Telegram bot."""
    webhook_url = f"{ngrok_url}/webhook/{bot_token}"
    url = f"https://api.telegram.org/bot{bot_token}/setWebhook"
    payload = {
        "url": webhook_url
    }
    print(f"Setting webhook to: {webhook_url}")
    response = requests.post(url, json=payload)
    return response.json()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 set_telegram_webhook.py <bot_token> <ngrok_url>")
        sys.exit(1)

    bot_token = sys.argv[1]
    ngrok_url = sys.argv[2]

    result = set_webhook(bot_token, ngrok_url)
    print("\nTelegram API Response:")
    print(result)

    if result.get("ok"):
        print("\nWebhook set successfully!")
        print("Your bot is now live and will send messages to your backend.")
    else:
        print("\nError setting webhook.")
        print(f"Description: {result.get('description')}")
