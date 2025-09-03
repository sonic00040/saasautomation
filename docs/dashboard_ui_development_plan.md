### **Dashboard UI Development Plan**

This plan outlines the steps to build the Minimum Viable Product (MVP) of the dashboard UI, incorporating React and Shadcn UI.

**Phase 3.1: Project Setup & Core Structure**

*   **Task 3.1.1: Initialize React Project:**
    *   Create a new React application within a `frontend` directory using Vite (for a fast development experience).
    *   **Goal:** A basic, runnable React app.
*   **Task 3.1.2: Install Shadcn UI & Tailwind CSS:**
    *   Set up Shadcn UI components and configure Tailwind CSS within the React project.
    *   **Goal:** Frontend project ready to use Shadcn UI components and custom styling.
*   **Task 3.1.3: Implement Dashboard Layout (Shell):**
    *   Create the main `DashboardLayout` component, including the Left Sidebar (for navigation) and the Top Header (for user info/logout).
    *   **Goal:** A consistent navigation and header structure for all dashboard pages.
*   **Task 3.1.4: Setup Routing:**
    *   Configure React Router to manage navigation between the main dashboard pages (Overview, Settings, Knowledge Base).
    *   **Goal:** Navigable placeholder pages within the dashboard layout.

**Phase 3.2: Authentication & Plan Selection UI**

*   **Task 3.2.1: Create Login Page UI:**
    *   Build the user interface for the Login page, including email and password input fields, and a login button, using Shadcn UI components.
    *   **Goal:** A visually complete login form.
*   **Task 3.2.2: Create Sign Up Page UI:**
    *   Build the user interface for the Sign Up page, including email, password, and password confirmation fields, using Shadcn UI components.
    *   **Goal:** A visually complete sign-up form.
*   **Task 3.2.3: Create Plan Selection Page UI:**
    *   Build the user interface for the Plan Selection page, displaying the four subscription plans (Basic, Basic Pro, Premium, Unlimited) with their features and pricing, using Shadcn UI `Card` and `Button` components.
    *   **Goal:** A visually complete plan selection interface.

**Phase 3.3: Core Dashboard Pages UI**

*   **Task 3.3.1: Create Overview Page UI:**
    *   Build the user interface for the Overview page, including cards for token usage (with a progress bar), current plan, and subscription period cards, using Shadcn UI `Card` and `Progress` components.
    *   **Goal:** A visually complete dashboard overview.
*   **Task 3.3.2: Create Settings Page UI:**
    *   Build the user interface for the Settings page, including input fields for Telegram and WhatsApp tokens, and a save button, using Shadcn UI `Form` and `Input` components.
    *   **Goal:** A visually complete settings form.
*   **Task 3.3.3: Create Knowledge Base Page UI:**
    *   Build the user interface for the Knowledge Base page, including a `Textarea` for content editing and an update button, using Shadcn UI components.
    *   **Goal:** A visually complete knowledge base management interface.

**Phase 3.4: Backend Integration (Connecting UI to API)**

*   **Task 3.4.1: Implement Authentication Logic:**
    *   Connect the Login and Sign Up pages to the backend authentication (Supabase Auth).
    *   **Goal:** Users can register and log in.
*   **Task 3.4.2: Integrate Plan Selection:**
    *   Connect the Plan Selection page to the backend to create and manage user subscriptions.
    *   **Goal:** Users can select and subscribe to plans.
*   **Task 3.4.3: Fetch Dashboard Data:**
    *   Connect the Overview page to fetch user, plan, and usage data from the backend API.
    *   **Goal:** Dashboard displays real-time user data.
*   **Task 3.4.4: Integrate Settings API:**
    *   Connect the Settings page to update Telegram/WhatsApp tokens via the backend API.
    *   **Goal:** Users can save their bot integration tokens.
*   **Task 3.4.5: Integrate Knowledge Base API:**
    *   Connect the Knowledge Base page to fetch and update knowledge base content via the backend API.
    *   **Goal:** Users can manage their bot's knowledge base through the UI.
