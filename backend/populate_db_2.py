from database import supabase
from datetime import datetime, timedelta

KNOWLEDGE_BASE_TEXT = """
The company is called TechNova Electronics Ltd., incorporated in 2012 and actively operating for more than 13 years. Its corporate headquarters is located in Nairobi, Kenya, with additional regional offices in Dubai (UAE), Berlin (Germany), and Johannesburg (South Africa). The company also maintains logistics hubs in Mombasa, Cape Town, and London, ensuring smooth international distribution.

TechNova Electronics specializes in the design, import, and retail of consumer electronics and smart gadgets, including smartphones, laptops, smartwatches, gaming consoles, audio equipment, home appliances, and accessories. The company also produces its own brand of devices under the TechNova™ label, focusing on affordable, high-performance smartphones and laptops targeted at emerging markets.

The company serves a customer base of over 120,000 individuals and 3,500 corporate clients, with an annual sales volume exceeding $50 million. Its products are distributed across 65+ countries, with primary markets in Africa, Europe, and the Middle East.

The TechNova distribution system is powered by AI-driven inventory management and automated warehousing technology, allowing for same-day order processing. Shipping timelines are 1–2 working days within Kenya, 2–5 working days across Africa, and 5–10 working days internationally, depending on the destination. Every shipment includes a real-time tracking number integrated with DHL, FedEx, and UPS systems.

TechNova accepts a wide range of payment methods, including Visa, Mastercard, American Express, PayPal, bank transfers, Mobile Money (M-Pesa, Airtel Money, MTN Mobile Money), and cryptocurrency payments in Bitcoin and Ethereum. Corporate clients may also apply for net-30 invoice billing or installment-based financing for bulk orders.

The company offers a 12-month warranty on all TechNova-branded products and a standard manufacturer’s warranty on third-party brands. A 14-day return and exchange policy is available for all customers, provided items are unused and returned in original packaging. Additionally, TechNova runs an extended protection plan allowing customers to insure devices for accidental damage and theft for up to 2 years.

Customer support operates on a 24/7 basis through live chat, email, Telegram, WhatsApp, and a toll-free hotline. The dedicated support team handles queries in English, French, Arabic, and Swahili, ensuring accessibility for a diverse customer base. For corporate clients, TechNova assigns dedicated account managers to streamline orders, repairs, and supply contracts.

TechNova Electronics also maintains an e-commerce website (www.technova.com) and a mobile app (TechNova Store) available on iOS and Android, where customers can browse catalogs, place orders, track shipments, access digital invoices, and join loyalty programs.

The company is driven by a strong commitment to sustainability and innovation. It sources eco-friendly materials, runs e-waste recycling programs in partnership with local governments, and invests 5% of annual revenue in R&D for smart, energy-efficient products.

TechNova’s mission is clear: to bridge technology gaps in emerging markets by delivering high-quality electronics at accessible prices while maintaining world-class service standards.
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
    print("Let's add the new company to your database.")

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

        print("\nDatabase populated with test data for the new company!")
        print("You can now set the webhook for the new bot.")

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please check the details you provided and your database schema.")

if __name__ == "__main__":
    main()
