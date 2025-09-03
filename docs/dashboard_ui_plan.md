### **Dashboard Layout Plan**

**1. Overall Structure**

We'll use a standard and intuitive two-column layout:

*   **Left Sidebar (Navigation):** A navigation bar that will always be visible on the left side of the screen. It will contain links to the main pages of the dashboard.
*   **Main Content Area:** The large area on the right where the content for each page will be displayed.

**2. Page-by-Page Design**

Here’s what each page in the sidebar will contain:

**A. Overview Page (The first page you see after logging in)**

*   **Header:** A welcoming message, like "Welcome, UrbanStep Footwear Ltd!".
*   **Key Metrics Section:** A row of cards at the top for a quick summary:
    *   **Token Usage Card:** A prominent card showing the current usage as a fraction (e.g., `418 / 1,050,000`) with a visual progress bar.
    *   **Current Plan Card:** A card displaying the user's current subscription plan (e.g., "Basic Plan").
    *   **Subscription Period Card:** A card showing the start and end date of the current billing cycle.
*   **Recent Activity Section:** A simple table or list below the cards showing the most recent interactions or usage logs (e.g., "AI response sent - 5 tokens used - 2 minutes ago").

**B. Settings Page**

*   **Header:** "Channel Integrations".
*   **Telegram Section:**
    *   A clear label: "Telegram Bot Token".
    *   A text input field where the user can paste their token.
    *   A "Save" button.
*   **WhatsApp Section:**
    *   A similar input field for the "WhatsApp Identifier".
    *   We can disable this for now and add a "Coming Soon" label to it.

**C. Knowledge Base Page**

*   **Header:** "Manage Your Knowledge Base".
*   **Content Area:** A large text box where the user can paste or edit their knowledge base content. This gives them direct control to update the AI's knowledge.
*   **"Update Knowledge Base" Button:** A button to save any changes made to the text.

---

**Visual Style:**

To make the dashboard look professional and polished from the start, I recommend using a popular UI library like **Material-UI (MUI)**. This will give us clean components like cards, buttons, and input fields that follow modern design principles, without us having to build them from scratch.

---

### **Future-Proofing the Dashboard**

The current dashboard design is built with future scalability and feature differentiation in mind. This section outlines how we will accommodate new features, especially those tied to different subscription plans.

**1. Modular UI Design:**
*   Each core feature (Overview, Settings, Knowledge Base) is designed as a distinct, modular page.
*   New features for higher-tier plans (e.g., "Analytics & Insights," "Automation & Integrations") will be added as new, separate pages in the sidebar navigation. This keeps the codebase organized and allows for easy expansion without disrupting existing functionalities.

**2. Feature Flagging / Conditional Rendering:**
*   This is the primary mechanism for handling plan-specific features.
*   When a user logs in, the backend provides information about their active subscription and plan details.
*   The frontend will implement logic to conditionally render UI components or entire navigation items based on the user's plan. For example, a "Conversation Analytics" link in the sidebar would only appear if the user's plan includes that feature.
*   This ensures that users only see and interact with features relevant to their subscription level, providing a tailored experience without requiring entirely separate dashboard builds for each plan.

**3. Extensibility:**
*   The component-based nature of React and the use of a design system like Shadcn UI promote reusability and extensibility.
*   The backend is also designed to be extensible, allowing for new API endpoints to support future features as needed.

This approach ensures that as your product evolves and new features are introduced, the dashboard can seamlessly grow and adapt, providing a clear path for upgrades and a tailored experience for each user tier.
