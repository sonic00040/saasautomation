#!/usr/bin/env python3
"""
TechNova Electronics - Test Data Setup Script
==============================================
This script populates your Supabase database with test data for the BotAI Telegram bot.

It creates:
- A test company (TechNova Electronics)
- A subscription plan (Pro Plan)
- An active subscription
- Complete knowledge base content

Prerequisites:
- Supabase database must be active and unpaused
- Database schema must be created (run supabase-schema.sql first)
- Environment variables must be set in .env file
"""

from database import supabase
from datetime import datetime, timedelta
import sys

# TechNova Electronics Knowledge Base
TECHNOVA_KNOWLEDGE_BASE = """
The company is called TechNova Electronics Ltd., incorporated in 2012 and actively operating for more than 13 years. Its corporate headquarters is located in Nairobi, Kenya, with additional regional offices in Dubai (UAE), Berlin (Germany), and Johannesburg (South Africa). The company also maintains logistics hubs in Mombasa, Cape Town, and London, ensuring smooth international distribution.

TechNova Electronics specializes in the design, import, and retail of consumer electronics and smart gadgets, including smartphones, laptops, smartwatches, gaming consoles, audio equipment, home appliances, and accessories. The company also produces its own brand of devices under the TechNova™ label, focusing on affordable, high-performance smartphones and laptops targeted at emerging markets.

The company serves a customer base of over 120,000 individuals and 3,500 corporate clients, with an annual sales volume exceeding $50 million. Its products are distributed across 65+ countries, with primary markets in Africa, Europe, and the Middle East.

The TechNova distribution system is powered by AI-driven inventory management and automated warehousing technology, allowing for same-day order processing. Shipping timelines are 1–2 working days within Kenya, 2–5 working days across Africa, and 5–10 working days internationally, depending on the destination. Every shipment includes a real-time tracking number integrated with DHL, FedEx, and UPS systems.

TechNova accepts a wide range of payment methods, including Visa, Mastercard, American Express, PayPal, bank transfers, Mobile Money (M-Pesa, Airtel Money, MTN Mobile Money), and cryptocurrency payments in Bitcoin and Ethereum. Corporate clients may also apply for net-30 invoice billing or installment-based financing for bulk orders.

The company offers a 12-month warranty on all TechNova-branded products and a standard manufacturer's warranty on third-party brands. A 14-day return and exchange policy is available for all customers, provided items are unused and returned in original packaging. Additionally, TechNova runs an extended protection plan allowing customers to insure devices for accidental damage and theft for up to 2 years.

Customer support operates on a 24/7 basis through live chat, email, Telegram, WhatsApp, and a toll-free hotline. The dedicated support team handles queries in English, French, Arabic, and Swahili, ensuring accessibility for a diverse customer base. For corporate clients, TechNova assigns dedicated account managers to streamline orders, repairs, and supply contracts.

TechNova Electronics also maintains an e-commerce website (www.technova.com) and a mobile app (TechNova Store) available on iOS and Android, where customers can browse catalogs, place orders, track shipments, access digital invoices, and join loyalty programs.

The company is driven by a strong commitment to sustainability and innovation. It sources eco-friendly materials, runs e-waste recycling programs in partnership with local governments, and invests 5% of annual revenue in R&D for smart, energy-efficient products.

TechNova's mission is clear: to bridge technology gaps in emerging markets by delivering high-quality electronics at accessible prices while maintaining world-class service standards.
"""

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def print_success(text):
    """Print success message"""
    print(f"✅ {text}")

def print_error(text):
    """Print error message"""
    print(f"❌ {text}")

def print_info(text):
    """Print info message"""
    print(f"ℹ️  {text}")

def check_database_connection():
    """Verify database connection"""
    print_header("Step 1: Checking Database Connection")
    try:
        # Try to query a simple table
        result = supabase.table('companies').select('id').limit(1).execute()
        print_success("Database connection successful!")
        return True
    except Exception as e:
        print_error(f"Database connection failed: {e}")
        print_info("Make sure you have run the database schema scripts first:")
        print_info("  1. supabase-schema.sql")
        print_info("  2. supabase-functions.sql")
        print_info("  3. supabase-rls.sql")
        return False

def check_existing_data():
    """Check if test data already exists"""
    print_header("Step 2: Checking for Existing Test Data")

    try:
        # Check for existing TechNova company
        company = supabase.table('companies').select('*').eq('email', 'test@technova.com').execute()

        if company.data and len(company.data) > 0:
            print_info("Found existing TechNova test data!")
            print(f"   Company ID: {company.data[0]['id']}")
            print(f"   Company Name: {company.data[0]['name']}")
            print(f"   Telegram Token: {company.data[0].get('telegram_bot_token', 'Not set')}")

            response = input("\n⚠️  Do you want to delete and recreate the test data? (yes/no): ")
            if response.lower() in ['yes', 'y']:
                print_info("Deleting existing test data...")
                supabase.table('companies').delete().eq('email', 'test@technova.com').execute()
                print_success("Existing data deleted!")
                return None
            else:
                print_info("Keeping existing data. Update manually if needed.")
                return company.data[0]
        else:
            print_success("No existing test data found. Ready to create new data.")
            return None

    except Exception as e:
        print_error(f"Error checking existing data: {e}")
        return None

def create_plan():
    """Create a subscription plan"""
    print_header("Step 3: Creating Subscription Plan")

    try:
        # Check if plan already exists
        existing = supabase.table('plans').select('*').eq('name', 'Pro Plan - Test').execute()

        if existing.data and len(existing.data) > 0:
            print_success("Pro Plan already exists!")
            plan_id = existing.data[0]['id']
        else:
            # Create new plan
            plan_data = {
                'name': 'Pro Plan - Test',
                'price': 29.99,
                'token_limit': 50000,
                'features': {
                    'bots': 5,
                    'knowledge_items': 100,
                    'support': '24/7',
                    'analytics': True
                },
                'is_active': True
            }

            result = supabase.table('plans').insert(plan_data).execute()
            plan_id = result.data[0]['id']
            print_success("Pro Plan created successfully!")

        print_info(f"Plan ID: {plan_id}")
        print_info(f"Token Limit: 50,000 tokens/month")
        print_info(f"Price: $29.99/month")

        return plan_id

    except Exception as e:
        print_error(f"Error creating plan: {e}")
        return None

def create_company(telegram_token):
    """Create TechNova Electronics company"""
    print_header("Step 4: Creating TechNova Electronics Company")

    try:
        company_data = {
            'name': 'TechNova Electronics Ltd.',
            'email': 'test@technova.com',
            'telegram_bot_token': telegram_token
        }

        result = supabase.table('companies').insert(company_data).execute()
        company_id = result.data[0]['id']

        print_success("TechNova Electronics company created!")
        print_info(f"Company ID: {company_id}")
        print_info(f"Company Name: TechNova Electronics Ltd.")
        print_info(f"Company Email: test@technova.com")
        print_info(f"Telegram Bot Token: {telegram_token}")

        return company_id

    except Exception as e:
        print_error(f"Error creating company: {e}")
        return None

def create_subscription(company_id, plan_id):
    """Create active subscription"""
    print_header("Step 5: Creating Active Subscription")

    try:
        start_date = datetime.now()
        end_date = start_date + timedelta(days=30)

        subscription_data = {
            'company_id': company_id,
            'plan_id': plan_id,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'is_active': True
        }

        result = supabase.table('subscriptions').insert(subscription_data).execute()
        subscription_id = result.data[0]['id']

        print_success("Subscription created successfully!")
        print_info(f"Subscription ID: {subscription_id}")
        print_info(f"Start Date: {start_date.strftime('%Y-%m-%d')}")
        print_info(f"End Date: {end_date.strftime('%Y-%m-%d')}")
        print_info(f"Status: Active ✅")

        return subscription_id

    except Exception as e:
        print_error(f"Error creating subscription: {e}")
        return None

def create_knowledge_base(company_id):
    """Create knowledge base with TechNova content"""
    print_header("Step 6: Adding TechNova Knowledge Base")

    try:
        kb_data = {
            'company_id': company_id,
            'content': TECHNOVA_KNOWLEDGE_BASE,
            'title': 'TechNova Electronics - Company Information',
            'file_name': 'technova_knowledge_base.txt',
            'file_size': len(TECHNOVA_KNOWLEDGE_BASE),
            'file_type': 'text/plain'
        }

        result = supabase.table('knowledge_bases').insert(kb_data).execute()
        kb_id = result.data[0]['id']

        print_success("Knowledge base created successfully!")
        print_info(f"Knowledge Base ID: {kb_id}")
        print_info(f"Content Size: {len(TECHNOVA_KNOWLEDGE_BASE)} characters")
        print_info(f"Title: TechNova Electronics - Company Information")

        return kb_id

    except Exception as e:
        print_error(f"Error creating knowledge base: {e}")
        return None

def display_summary(company_id, plan_id, subscription_id, kb_id, telegram_token):
    """Display setup summary"""
    print_header("🎉 Setup Complete!")

    print("\n📋 Test Configuration Summary:")
    print("-" * 70)
    print(f"  Company ID:        {company_id}")
    print(f"  Plan ID:           {plan_id}")
    print(f"  Subscription ID:   {subscription_id}")
    print(f"  Knowledge Base ID: {kb_id}")
    print(f"  Telegram Token:    {telegram_token}")
    print("-" * 70)

    print("\n✅ Your test environment is ready!")
    print("\n📝 Next Steps:")
    print("  1. Run automated tests:")
    print("     python3 backend/test_bot.py")
    print("\n  2. Or test manually with a real Telegram bot:")
    print("     a. Start the backend server:")
    print("        cd backend && uvicorn main:app --reload --port 8000")
    print("     b. Expose with ngrok:")
    print("        ngrok http 8000")
    print("     c. Set webhook:")
    print(f"        python3 backend/set_telegram_webhook.py {telegram_token} <ngrok_url>")
    print("     d. Send a message to your Telegram bot!")
    print("\n  3. Sample test questions to ask your bot:")
    print("     - What are your shipping times to Dubai?")
    print("     - Do you accept cryptocurrency?")
    print("     - What's your warranty policy?")
    print("     - How can I contact support?")
    print("\n" + "=" * 70)

def main():
    """Main setup function"""
    print_header("TechNova Electronics - Test Data Setup")
    print("This script will set up test data for your BotAI Telegram bot.\n")

    # Step 1: Check database connection
    if not check_database_connection():
        sys.exit(1)

    # Step 2: Check existing data
    existing_company = check_existing_data()
    if existing_company:
        print_info("Setup cancelled. Using existing test data.")
        return

    # Get Telegram bot token
    print("\n" + "-" * 70)
    telegram_token = input("📱 Enter your Telegram Bot Token: ").strip()

    if not telegram_token:
        print_error("Telegram bot token is required!")
        sys.exit(1)

    # Step 3: Create plan
    plan_id = create_plan()
    if not plan_id:
        sys.exit(1)

    # Step 4: Create company
    company_id = create_company(telegram_token)
    if not company_id:
        sys.exit(1)

    # Step 5: Create subscription
    subscription_id = create_subscription(company_id, plan_id)
    if not subscription_id:
        sys.exit(1)

    # Step 6: Create knowledge base
    kb_id = create_knowledge_base(company_id)
    if not kb_id:
        sys.exit(1)

    # Display summary
    display_summary(company_id, plan_id, subscription_id, kb_id, telegram_token)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
