## List of Screens to be Made (Dashboard UI MVP)

1.  **Login Page**
    *   **Description:** This will be the initial entry point for existing users. It will feature a clean, centered layout with fields for email and password.
    *   **Key Components (Shadcn UI):** `Input` for email and password, `Button` for login, `Card` or `Form` for structuring the login panel, and a `Link` (or custom text link) for "Sign Up" or "Forgot Password?".

2.  **Sign Up Page**
    *   **Description:** For new users to create their account. It will include fields for email, password, and password confirmation.
    *   **Key Components (Shadcn UI):** Similar to the Login page, utilizing `Input`, `Button`, `Card`/`Form`, and a `Link` back to the login page.

3.  **Plan Selection Page**
    *   **Description:** After a user signs up (or if they log in without an active plan), they'll land here. This page will clearly present the four subscription tiers (Basic, Basic Pro, Premium, Unlimited) with their key features and pricing.
    *   **Key Components (Shadcn UI):** Multiple `Card` components, each representing a plan, to showcase details. `Button` components for "Select Plan" or "Subscribe". We might use `Badge` for highlighting specific features or "Most Popular" labels.

4.  **Dashboard Layout (Shell)**
    *   **Description:** This is the foundational structure that will house all the main dashboard content. It provides consistent navigation and branding across the application.
    *   **Key Components (Shadcn UI):**
        *   **Sidebar:** A custom navigation component on the left, likely using `Button` or `Link` elements for navigation items (e.g., "Overview", "Settings", "Knowledge Base").
        *   **Header:** A top bar containing the user's company name/email, possibly a `DropdownMenu` for user actions like "Logout" or "Profile".
        *   **Main Content Area:** The dynamic region where the content of the selected page will be rendered.

5.  **Overview Page**
    *   **Description:** The primary landing page within the dashboard, offering a quick summary of the user's account status and token usage.
    *   **Key Components (Shadcn UI):**
        *   `Card` components to display key metrics like "Token Usage", "Current Plan", and "Subscription Period".
        *   `Progress` component for a visual representation of token usage.
        *   A simple `Table` or list for "Recent Activity" (this can be a placeholder for now).
        *   Standard `Typography` for titles and descriptive text.

6.  **Settings Page**
    *   **Description:** Allows users to configure their bot's integration tokens.
    *   **Key Components (Shadcn UI):**
        *   `Form` for organizing input fields.
        *   `Input` for entering tokens.
        *   `Button` for "Save Changes".
        *   `Label` for input field descriptions.
        *   `Alert` or `Toast` for displaying success or error messages after saving.

7.  **Knowledge Base Page**
    *   **Description:** Provides an interface for users to view and update their bot's knowledge base content.
    *   **Key Components (Shadcn UI):**
        *   `Textarea` for editing the knowledge base content.
        *   `Button` for "Update Knowledge Base".
        *   `Alert` or `Toast` for feedback messages.
