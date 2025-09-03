from database import supabase
from datetime import datetime, timedelta

KNOWLEDGE_BASE_TEXT = """
The company is called UrbanStep Footwear Ltd. It was established in 2014 and has been operating for over 11 years. The headquarters is located in Accra, Ghana, with additional distribution centers in Lagos, Nigeria and London, UK.

UrbanStep specializes in athletic sneakers, casual footwear, formal leather shoes, sandals, and limited-edition collaborations. The company serves over 70,000 active customers worldwide and delivers to more than 45 countries.

Products are manufactured using premium leather, lightweight rubber soles, and eco-friendly materials. Each item goes through a triple-layer quality control process before leaving the warehouse.

Shipping timelines are 1–3 working days within Ghana and Nigeria, and 5–8 working days internationally. All orders come with a tracking number. Customers can also arrange in-store pickup at the Accra and Lagos branches.

Accepted payment methods include Visa, Mastercard, PayPal, Mobile Money, and bank transfers. Cash on delivery is available only for orders placed within Accra.

UrbanStep offers a 7-day return policy and a 3-month warranty against manufacturing defects. Customers can request size exchanges within the same timeframe.

Customer support is available 24/7 via WhatsApp, Telegram, and email. The official contact number is +233 550 123 456, and the support email is support@urbanstep.com.

The company operates an official website at www.urbanstep.com, where customers can browse catalogs, track orders, and access exclusive promotions.
"""

def add_knowledge_base(company_id: str, content: str):
    """Adds a knowledge base for a given company."""
    print("Adding knowledge base...")
    supabase.table('knowledge_bases').insert({
        "company_id": company_id,
        "content": content
    }).execute()
    print("Knowledge base added successfully.")

def main():
    print("Let's add some test data to your database.")

    # Get company details
    company_name = input("Enter company name: ")
    company_email = input("Enter company email: ")
    telegram_token = input("Enter Telegram bot token: ")

    # Get plan details
    plan_name = input("Enter plan name (e.g., 'Basic'): ")
    plan_price = float(input("Enter plan price (e.g., 10.00): "))
    plan_token_limit = int(input("Enter plan token limit (e.g., 100000): "))

    try:
        # Create a new plan
        print(f"Creating plan: {plan_name}...")
        plan_response = supabase.table('plans').insert({
            "name": plan_name,
            "price": plan_price,
            "token_limit": plan_token_limit
        }).execute()
        plan_id = plan_response.data[0]['id']
        print("Plan created successfully.")

        # Create a new company
        print(f"Creating company: {company_name}...")
        company_response = supabase.table('companies').insert({
            "name": company_name,
            "email": company_email,
            "telegram_bot_token": telegram_token
        }).execute()
        company_id = company_response.data[0]['id']
        print("Company created successfully.")

        # Add knowledge base
        add_knowledge_base(company_id, KNOWLEDGE_BASE_TEXT)

        # Create a new subscription
        print("Creating subscription...")
        start_date = datetime.now().isoformat()
        end_date = (datetime.now() + timedelta(days=30)).isoformat()
        supabase.table('subscriptions').insert({
            "company_id": company_id,
            "plan_id": plan_id,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }).execute()
        print("Subscription created successfully.")

        print("\nDatabase populated with test data!")
        print("You can now test the webhook endpoint with your new Telegram token.")

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please check the details you provided and your database schema.")

if __name__ == "__main__":
    main()
