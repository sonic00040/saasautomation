from database import supabase

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

def main():
    print("Let's add the knowledge base to an existing company.")
    company_email = input("Enter the email of the company to add the knowledge base to: ")

    try:
        # Find the company by email
        response = supabase.table('companies').select('id').eq('email', company_email).single().execute()
        if not response.data:
            print(f"Error: Company with email '{company_email}' not found.")
            return

        company_id = response.data['id']
        print(f"Found company with ID: {company_id}")

        # Add the knowledge base
        print("Adding knowledge base...")
        supabase.table('knowledge_bases').insert({
            "company_id": company_id,
            "content": KNOWLEDGE_BASE_TEXT
        }).execute()
        print("Knowledge base added successfully!")
        print("You can now test the webhook endpoint.")

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please check the email you provided and your database schema.")

if __name__ == "__main__":
    main()
