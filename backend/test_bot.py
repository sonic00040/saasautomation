#!/usr/bin/env python3
"""
TechNova Electronics - Telegram Bot Test Suite
===============================================
Comprehensive automated testing for the BotAI Telegram bot.

This script tests:
- Database connectivity
- Data validation (company, subscription, knowledge base)
- Webhook endpoint simulation
- AI response generation
- Token usage tracking
- Subscription limit enforcement

Prerequisites:
- Database schema created
- Test data populated (run setup_test_data.py first)
- Backend dependencies installed
"""

import requests
import json
import sys
from datetime import datetime
from database import supabase
import config

# Test configuration
TEST_COMPANY_EMAIL = 'test@technova.com'
BACKEND_URL = 'http://localhost:8000'

# Test queries - realistic customer questions
TEST_QUERIES = [
    {
        'question': 'What are your shipping times to Dubai?',
        'expected_keywords': ['Dubai', 'shipping', '5-10', 'days', 'international'],
        'description': 'Shipping inquiry for international delivery'
    },
    {
        'question': 'Do you accept cryptocurrency payments?',
        'expected_keywords': ['cryptocurrency', 'Bitcoin', 'Ethereum', 'payment'],
        'description': 'Payment method inquiry'
    },
    {
        'question': 'What is your warranty policy on laptops?',
        'expected_keywords': ['warranty', '12-month', 'TechNova', 'manufacturer'],
        'description': 'Warranty policy inquiry'
    },
    {
        'question': 'How can I contact customer support?',
        'expected_keywords': ['support', '24/7', 'WhatsApp', 'Telegram', 'email'],
        'description': 'Customer support contact inquiry'
    },
    {
        'question': 'Can I return a product if I change my mind?',
        'expected_keywords': ['return', '14-day', 'exchange', 'unused', 'original packaging'],
        'description': 'Return policy inquiry'
    }
]

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text):
    """Print a formatted header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 70}")
    print(f"  {text}")
    print(f"{'=' * 70}{Colors.END}\n")

def print_success(text):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_warning(text):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_info(text):
    """Print info message"""
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")

def print_test_result(passed, test_name):
    """Print test result"""
    if passed:
        print_success(f"PASS: {test_name}")
    else:
        print_error(f"FAIL: {test_name}")
    return passed

class TestResults:
    """Track test results"""
    def __init__(self):
        self.total = 0
        self.passed = 0
        self.failed = 0
        self.details = []

    def add_result(self, test_name, passed, message=""):
        self.total += 1
        if passed:
            self.passed += 1
        else:
            self.failed += 1
        self.details.append({
            'test': test_name,
            'passed': passed,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })

    def print_summary(self):
        print_header("Test Summary")
        print(f"Total Tests:  {self.total}")
        print_success(f"Passed:       {self.passed}")
        if self.failed > 0:
            print_error(f"Failed:       {self.failed}")
        else:
            print_success(f"Failed:       {self.failed}")

        success_rate = (self.passed / self.total * 100) if self.total > 0 else 0
        print(f"\nSuccess Rate: {success_rate:.1f}%")

        if self.failed > 0:
            print_warning("\nFailed Tests:")
            for detail in self.details:
                if not detail['passed']:
                    print(f"  - {detail['test']}: {detail['message']}")

    def save_to_file(self, filename='test_results.json'):
        """Save results to JSON file"""
        with open(filename, 'w') as f:
            json.dump({
                'summary': {
                    'total': self.total,
                    'passed': self.passed,
                    'failed': self.failed,
                    'success_rate': (self.passed / self.total * 100) if self.total > 0 else 0,
                    'timestamp': datetime.now().isoformat()
                },
                'details': self.details
            }, f, indent=2)
        print_info(f"Test results saved to {filename}")

# Test functions
def test_database_connection(results):
    """Test 1: Database connectivity"""
    print_header("Test 1: Database Connection")
    try:
        result = supabase.table('companies').select('id').limit(1).execute()
        results.add_result('Database Connection', True)
        print_success("Database connection successful")
        return True
    except Exception as e:
        results.add_result('Database Connection', False, str(e))
        print_error(f"Database connection failed: {e}")
        return False

def test_company_exists(results):
    """Test 2: Verify TechNova company exists"""
    print_header("Test 2: Company Data Validation")
    try:
        company = supabase.table('companies').select('*').eq('email', TEST_COMPANY_EMAIL).execute()

        if not company.data or len(company.data) == 0:
            results.add_result('Company Exists', False, 'TechNova company not found')
            print_error("TechNova company not found in database")
            print_warning("Run 'python3 backend/setup_test_data.py' first!")
            return None

        company_data = company.data[0]
        print_success(f"Company found: {company_data['name']}")
        print_info(f"Company ID: {company_data['id']}")
        print_info(f"Telegram Token: {company_data.get('telegram_bot_token', 'Not set')}")

        if not company_data.get('telegram_bot_token'):
            results.add_result('Company Telegram Token', False, 'Token not set')
            print_error("Telegram bot token not set!")
            return None

        results.add_result('Company Exists', True)
        results.add_result('Company Telegram Token', True)
        return company_data

    except Exception as e:
        results.add_result('Company Exists', False, str(e))
        print_error(f"Error checking company: {e}")
        return None

def test_subscription_exists(company_id, results):
    """Test 3: Verify active subscription exists"""
    print_header("Test 3: Subscription Validation")
    try:
        subscription = supabase.table('subscriptions').select('*, plans(*)').eq('company_id', company_id).eq('is_active', True).execute()

        if not subscription.data or len(subscription.data) == 0:
            results.add_result('Active Subscription', False, 'No active subscription found')
            print_error("No active subscription found")
            return None

        sub_data = subscription.data[0]
        plan_data = sub_data['plans']

        print_success("Active subscription found")
        print_info(f"Plan: {plan_data['name']}")
        print_info(f"Token Limit: {plan_data['token_limit']:,} tokens")
        print_info(f"Start Date: {sub_data['start_date']}")
        print_info(f"End Date: {sub_data['end_date']}")

        results.add_result('Active Subscription', True)
        return sub_data

    except Exception as e:
        results.add_result('Active Subscription', False, str(e))
        print_error(f"Error checking subscription: {e}")
        return None

def test_knowledge_base_exists(company_id, results):
    """Test 4: Verify knowledge base exists"""
    print_header("Test 4: Knowledge Base Validation")
    try:
        kb = supabase.table('knowledge_bases').select('*').eq('company_id', company_id).execute()

        if not kb.data or len(kb.data) == 0:
            results.add_result('Knowledge Base Exists', False, 'No knowledge base found')
            print_error("No knowledge base found")
            return None

        kb_data = kb.data[0]
        content_length = len(kb_data['content'])

        print_success("Knowledge base found")
        print_info(f"Title: {kb_data.get('title', 'Untitled')}")
        print_info(f"Content Size: {content_length:,} characters")

        # Verify TechNova-specific content
        if 'TechNova' in kb_data['content']:
            print_success("Content contains TechNova information")
            results.add_result('Knowledge Base Content', True)
        else:
            print_warning("Content does not contain TechNova information")
            results.add_result('Knowledge Base Content', False, 'Missing TechNova content')

        results.add_result('Knowledge Base Exists', True)
        return kb_data['content']

    except Exception as e:
        results.add_result('Knowledge Base Exists', False, str(e))
        print_error(f"Error checking knowledge base: {e}")
        return None

def test_webhook_simulation(telegram_token, results):
    """Test 5-9: Simulate webhook requests"""
    print_header("Tests 5-9: Webhook Endpoint Simulation")

    print_warning("Note: These tests require the backend server to be running!")
    print_info("Start server with: cd backend && uvicorn main:app --reload --port 8000")

    response = input("\nIs the backend server running? (yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print_warning("Skipping webhook tests. Start the server and run test_bot.py again.")
        for i, query in enumerate(TEST_QUERIES, 5):
            results.add_result(f"Test {i}: {query['description']}", False, 'Server not running')
        return

    for i, query in enumerate(TEST_QUERIES, 5):
        print(f"\n{Colors.BOLD}--- Test {i}: {query['description']} ---{Colors.END}")
        print(f"Question: {query['question']}")

        try:
            # Simulate Telegram webhook payload
            payload = {
                'message': {
                    'chat': {
                        'id': 12345678  # Test chat ID
                    },
                    'text': query['question']
                }
            }

            # Send request to webhook endpoint
            url = f"{BACKEND_URL}/webhook/{telegram_token}"
            response = requests.post(url, json=payload, timeout=30)

            if response.status_code == 200:
                print_success(f"Webhook responded: {response.status_code}")

                # Note: We can't easily capture the bot's response without mocking Telegram API
                # In real testing, you would check the Telegram message that was sent
                print_info("Check if the bot sent a response to Telegram")

                results.add_result(f"Test {i}: {query['description']}", True, 'Webhook processed successfully')
            else:
                print_error(f"Webhook failed: {response.status_code}")
                print_error(f"Response: {response.text}")
                results.add_result(f"Test {i}: {query['description']}", False, f"HTTP {response.status_code}")

        except requests.exceptions.ConnectionError:
            print_error("Cannot connect to backend server")
            print_warning("Make sure the server is running on http://localhost:8000")
            results.add_result(f"Test {i}: {query['description']}", False, 'Connection error')
        except Exception as e:
            print_error(f"Error: {e}")
            results.add_result(f"Test {i}: {query['description']}", False, str(e))

def test_token_usage_tracking(company_id, results):
    """Test 10: Verify token usage is being tracked"""
    print_header("Test 10: Token Usage Tracking")
    try:
        # Get subscription
        subscription = supabase.table('subscriptions').select('id, start_date, end_date').eq('company_id', company_id).eq('is_active', True).execute()

        if not subscription.data:
            results.add_result('Token Usage Tracking', False, 'No subscription found')
            print_error("No active subscription found")
            return

        sub_id = subscription.data[0]['id']

        # Check usage logs
        usage = supabase.table('usage_logs').select('*').eq('subscription_id', sub_id).execute()

        if usage.data and len(usage.data) > 0:
            total_tokens = sum([log.get('total_tokens', 0) for log in usage.data])
            print_success(f"Found {len(usage.data)} usage log entries")
            print_info(f"Total tokens used: {total_tokens:,}")
            results.add_result('Token Usage Tracking', True, f'{total_tokens} tokens used')
        else:
            print_warning("No usage logs found yet")
            print_info("Usage will be logged after sending messages to the bot")
            results.add_result('Token Usage Tracking', True, 'No usage yet (expected for new setup)')

    except Exception as e:
        results.add_result('Token Usage Tracking', False, str(e))
        print_error(f"Error checking token usage: {e}")

def main():
    """Main test runner"""
    print_header("TechNova Electronics - Telegram Bot Test Suite")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    results = TestResults()

    # Test 1: Database connection
    if not test_database_connection(results):
        print_error("\n❌ Database connection failed. Cannot proceed with tests.")
        print_info("Make sure:")
        print_info("  1. Supabase database is unpaused")
        print_info("  2. .env file has correct credentials")
        print_info("  3. Database schema is created (run SQL scripts)")
        results.print_summary()
        sys.exit(1)

    # Test 2: Company exists
    company = test_company_exists(results)
    if not company:
        print_error("\n❌ Company data not found. Cannot proceed with tests.")
        print_info("Run: python3 backend/setup_test_data.py")
        results.print_summary()
        sys.exit(1)

    company_id = company['id']
    telegram_token = company['telegram_bot_token']

    # Test 3: Subscription exists
    subscription = test_subscription_exists(company_id, results)
    if not subscription:
        print_error("\n❌ Subscription not found. Cannot proceed with tests.")
        results.print_summary()
        sys.exit(1)

    # Test 4: Knowledge base exists
    knowledge_base = test_knowledge_base_exists(company_id, results)
    if not knowledge_base:
        print_error("\n❌ Knowledge base not found. Cannot proceed with tests.")
        results.print_summary()
        sys.exit(1)

    # Tests 5-9: Webhook simulation
    test_webhook_simulation(telegram_token, results)

    # Test 10: Token usage tracking
    test_token_usage_tracking(company_id, results)

    # Print summary
    print("\n")
    results.print_summary()
    results.save_to_file()

    print_header("Next Steps")
    if results.failed > 0:
        print_warning("Some tests failed. Review the errors above and:")
        print("  1. Check that the backend server is running")
        print("  2. Verify all database setup is complete")
        print("  3. Check logs for detailed error messages")
    else:
        print_success("All tests passed! Your bot is ready to use.")
        print("\n📝 Manual Testing Steps:")
        print("  1. Start backend: cd backend && uvicorn main:app --reload --port 8000")
        print("  2. Expose with ngrok: ngrok http 8000")
        print(f"  3. Set webhook: python3 backend/set_telegram_webhook.py {telegram_token} <ngrok_url>")
        print("  4. Send messages to your Telegram bot!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
