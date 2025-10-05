#!/usr/bin/env python3
"""
Webhook Fix Script
Fixes all existing bots by setting their webhooks to the production Render URL
"""

import requests
import sys
from typing import List, Dict

# Bot tokens from database
BOTS = [
    {
        "token": "7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY",
        "name": "UrbanStep Footwear Ltd Bot"
    },
    {
        "token": "7532191997:AAHoAwwdmBxP55K7SU66SPNTGtcpl1jqJ0c",
        "name": "Harvest Table Foods Co Bot"
    },
    {
        "token": "8274270708:AAGbrSg8FzN3JZ3WOpFMutIRA6PjhKcTb7Q",
        "name": "OKas Bicycle Bot"
    }
]

def set_webhook(bot_token: str, backend_url: str) -> Dict:
    """Set webhook for a Telegram bot"""
    webhook_url = f"{backend_url}/webhook/{bot_token}"
    api_url = f"https://api.telegram.org/bot{bot_token}/setWebhook"

    response = requests.post(api_url, json={"url": webhook_url})
    return response.json()

def get_webhook_info(bot_token: str) -> Dict:
    """Get current webhook info for a bot"""
    api_url = f"https://api.telegram.org/bot{bot_token}/getWebhookInfo"
    response = requests.get(api_url)
    return response.json()

def main():
    print("=" * 60)
    print("🔧 WEBHOOK FIX SCRIPT")
    print("=" * 60)
    print()

    # Get backend URL from user
    if len(sys.argv) > 1:
        backend_url = sys.argv[1]
    else:
        backend_url = input("Enter your Render backend URL (e.g., https://botai-backend-xyz.onrender.com): ").strip()

    if not backend_url:
        print("❌ Error: Backend URL is required")
        sys.exit(1)

    # Remove trailing slash
    backend_url = backend_url.rstrip('/')

    print(f"\n📡 Backend URL: {backend_url}")
    print(f"\n🤖 Fixing {len(BOTS)} bots...\n")

    results = []

    for i, bot in enumerate(BOTS, 1):
        print(f"[{i}/{len(BOTS)}] Processing: {bot['name']}")
        print(f"    Token: {bot['token'][:20]}...")

        # Get current webhook
        current = get_webhook_info(bot['token'])
        if current.get('ok'):
            current_url = current.get('result', {}).get('url', '')
            print(f"    Current webhook: {current_url or '(none)'}")

        # Set new webhook
        result = set_webhook(bot['token'], backend_url)

        if result.get('ok'):
            print(f"    ✅ Webhook set successfully!")
            new_url = f"{backend_url}/webhook/{bot['token']}"
            print(f"    New webhook: {new_url}")
            results.append({
                "bot": bot['name'],
                "status": "success",
                "webhook": new_url
            })
        else:
            error = result.get('description', 'Unknown error')
            print(f"    ❌ Failed: {error}")
            results.append({
                "bot": bot['name'],
                "status": "failed",
                "error": error
            })

        print()

    # Summary
    print("=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)

    success_count = sum(1 for r in results if r['status'] == 'success')
    failed_count = len(results) - success_count

    print(f"\n✅ Success: {success_count}")
    print(f"❌ Failed: {failed_count}")

    if failed_count > 0:
        print("\nFailed bots:")
        for r in results:
            if r['status'] == 'failed':
                print(f"  - {r['bot']}: {r['error']}")

    print("\n" + "=" * 60)
    print("\n🔍 Next Steps:")
    print("1. Verify webhooks are set correctly:")
    print(f"   curl 'https://api.telegram.org/bot<TOKEN>/getWebhookInfo'")
    print("\n2. Update database to mark bots as active:")
    print("   Run the SQL commands in DEPLOYMENT_FIX_GUIDE.md Step 4")
    print("\n3. Test bots by sending messages in Telegram")
    print("=" * 60)

if __name__ == "__main__":
    main()
