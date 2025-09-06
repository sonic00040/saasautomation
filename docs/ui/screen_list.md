# UI Screen List
## AI Customer Support Chatbot SaaS Platform

*Generated from UI PRD - Complete list of screens to be developed*

---

## 1. Marketing Website Screens

### 1.1 Core Marketing Pages

#### 1.1.1 Landing Page (`/`)
- **Purpose**: Primary conversion page for new visitors
- **Key Components**:
  - Hero section with headline and CTAs
  - Features showcase (6 key features)
  - "How It Works" 4-step process
  - Pricing section with plan cards
  - Social proof (testimonials, statistics)
  - FAQ section
- **CTAs**: "Start Free Trial", "View Demo"

#### 1.1.2 Pricing Page (`/pricing`)
- **Purpose**: Detailed plan comparison and conversion
- **Key Components**:
  - Plan comparison cards (Starter/Professional/Enterprise)
  - Feature comparison matrix
  - Monthly/Annual toggle
  - Pricing FAQ
  - "Contact Sales" for enterprise
- **CTAs**: Plan selection buttons

#### 1.1.3 Features Page (`/features`)
- **Purpose**: Detailed feature explanations
- **Key Components**:
  - Feature sections with descriptions
  - Screenshots/demos
  - Use case examples
- **CTAs**: "Start Free Trial"

#### 1.1.4 About Page (`/about`)
- **Purpose**: Company credibility and team information
- **Key Components**:
  - Company mission and vision
  - Team member profiles
  - Company history/story
- **CTAs**: "Contact Us"

#### 1.1.5 Contact Page (`/contact`)
- **Purpose**: Support and sales inquiries
- **Key Components**:
  - Contact form
  - Support email and phone
  - Office address (if applicable)
  - Live chat widget

### 1.2 Legal & Documentation Pages

#### 1.2.1 Terms of Service (`/terms`)
- **Purpose**: Legal terms and conditions
- **Key Components**:
  - Service terms
  - User responsibilities
  - Limitations and disclaimers

#### 1.2.2 Privacy Policy (`/privacy`)
- **Purpose**: Data handling and privacy practices
- **Key Components**:
  - Data collection practices
  - Cookie policy
  - GDPR compliance information

#### 1.2.3 Documentation (`/docs`)
- **Purpose**: API documentation and guides
- **Key Components**:
  - Getting started guide
  - API reference
  - Integration tutorials
  - FAQ and troubleshooting

---

## 2. Authentication Screens

### 2.1 Registration Flow

#### 2.1.1 Sign Up Page (`/signup`)
- **Purpose**: New user registration
- **Key Components**:
  - Email and password form
  - Terms agreement checkbox
  - Social login options (future)
  - "Already have account?" link
- **Flow**: → Email Verification

#### 2.1.2 Email Verification (`/verify-email`)
- **Purpose**: Confirm email address
- **Key Components**:
  - Verification message
  - Resend verification button
  - Change email option
- **Flow**: → Plan Selection

#### 2.1.3 Plan Selection (`/select-plan`)
- **Purpose**: Choose subscription plan during onboarding
- **Key Components**:
  - Plan cards with features
  - Skip trial option
  - Plan comparison
- **Flow**: → Payment (if paid) or Account Setup

#### 2.1.4 Payment Page (`/payment`)
- **Purpose**: Process subscription payment
- **Key Components**:
  - Stripe payment form
  - Order summary
  - Billing address
  - Payment security badges
- **Flow**: → Account Setup

#### 2.1.5 Account Setup (`/setup`)
- **Purpose**: Initial account configuration
- **Key Components**:
  - Company name input
  - Industry selection
  - Welcome message
  - Setup completion progress
- **Flow**: → Dashboard

### 2.2 Login Flow

#### 2.2.1 Login Page (`/login`)
- **Purpose**: User authentication
- **Key Components**:
  - Email and password form
  - "Remember me" checkbox
  - "Forgot password?" link
  - "Create account" link
- **Flow**: → Dashboard

#### 2.2.2 Forgot Password (`/forgot-password`)
- **Purpose**: Password reset request
- **Key Components**:
  - Email input form
  - Reset instructions
  - Back to login link
- **Flow**: → Reset Password Email

#### 2.2.3 Reset Password (`/reset-password`)
- **Purpose**: Set new password
- **Key Components**:
  - New password form
  - Password strength indicator
  - Confirmation field
- **Flow**: → Login

---

## 3. Dashboard Application Screens

### 3.1 Main Dashboard

#### 3.1.1 Dashboard Overview (`/dashboard`)
- **Purpose**: Central hub showing key metrics and status
- **Key Components**:
  - Status cards (Bot Status, Plan, Usage, Messages)
  - Quick action buttons
  - Recent activity feed
  - Usage summary sidebar
- **Navigation**: Main landing page after login

#### 3.1.2 Dashboard Layout (Template)
- **Purpose**: Consistent layout for all dashboard pages
- **Key Components**:
  - Top navigation with logo and user menu
  - Main navigation (Dashboard, Knowledge Base, Analytics, Settings)
  - Collapsible sidebar
  - Breadcrumb navigation

### 3.2 Company Management

#### 3.2.1 Company Profile (`/dashboard/company`)
- **Purpose**: Manage company information
- **Key Components**:
  - Company details form (name, email, industry)
  - Logo upload
  - Contact information
  - Save/Cancel actions

#### 3.2.2 Team Management (`/dashboard/team`) *[Future Feature]*
- **Purpose**: Manage team members and permissions
- **Key Components**:
  - Team member list
  - Invite new members
  - Role assignment
  - Permission matrix

### 3.3 Bot Configuration

#### 3.3.1 Bot Setup Wizard (`/dashboard/bot/setup`)
- **Purpose**: Guide users through Telegram bot configuration
- **Key Components**:
  - Step-by-step wizard (4 steps)
  - Instructions for each step
  - Progress indicator
  - Next/Previous navigation
  - Skip options for advanced users

#### 3.3.2 Bot Configuration (`/dashboard/bot`)
- **Purpose**: Manage Telegram bot settings
- **Key Components**:
  - Bot token input (masked with reveal)
  - Webhook URL (auto-generated, copyable)
  - Connection status indicator
  - Last activity timestamp
  - Test connection button

#### 3.3.3 Bot Testing (`/dashboard/bot/test`)
- **Purpose**: Test bot functionality
- **Key Components**:
  - Test message input
  - Send test button
  - Response display
  - Debug information panel
  - Response time metrics

### 3.4 Knowledge Base Management

#### 3.4.1 Knowledge Base Overview (`/dashboard/knowledge`)
- **Purpose**: Main knowledge base management page
- **Key Components**:
  - Knowledge entries list/grid view
  - Search and filter bar
  - Upload new content button
  - Bulk actions (delete, organize)
  - Pagination

#### 3.4.2 Add Knowledge Content (`/dashboard/knowledge/add`)
- **Purpose**: Upload new knowledge base content
- **Key Components**:
  - File upload drag-and-drop area
  - Direct text input option
  - Content preview
  - Category/tag assignment
  - Priority level setting
  - Save/Cancel actions

#### 3.4.3 Edit Knowledge Entry (`/dashboard/knowledge/edit/:id`)
- **Purpose**: Edit existing knowledge base content
- **Key Components**:
  - Content editor (rich text)
  - Category management
  - Priority settings
  - Version history (future)
  - Save/Delete actions

#### 3.4.4 Knowledge Base Categories (`/dashboard/knowledge/categories`)
- **Purpose**: Organize knowledge content
- **Key Components**:
  - Category list
  - Add/Edit/Delete categories
  - Category assignment rules
  - Content count per category

### 3.5 Analytics & Usage

#### 3.5.1 Usage Analytics (`/dashboard/analytics`)
- **Purpose**: Monitor usage and performance metrics
- **Key Components**:
  - Usage overview cards
  - Token consumption charts (daily/weekly/monthly)
  - Messages processed count
  - Peak usage hours chart
  - Export data button

#### 3.5.2 Detailed Reports (`/dashboard/analytics/reports`)
- **Purpose**: In-depth analytics and reporting
- **Key Components**:
  - Date range selector
  - Detailed usage breakdowns
  - Performance metrics
  - Downloadable reports
  - Custom report builder (future)

#### 3.5.3 Alerts & Notifications (`/dashboard/alerts`)
- **Purpose**: Manage usage alerts and system notifications
- **Key Components**:
  - Alert settings (75%, 90%, 95% thresholds)
  - Notification preferences
  - Alert history
  - System status updates

### 3.6 Subscription Management

#### 3.6.1 Billing Overview (`/dashboard/billing`)
- **Purpose**: Current plan and billing information
- **Key Components**:
  - Current plan details
  - Usage vs. limits progress bars
  - Next billing date and amount
  - Quick upgrade options

#### 3.6.2 Plan Management (`/dashboard/billing/plans`)
- **Purpose**: Change subscription plans
- **Key Components**:
  - Available plans comparison
  - Upgrade/downgrade options
  - Plan change confirmation
  - Billing cycle options (monthly/annual)

#### 3.6.3 Billing History (`/dashboard/billing/history`)
- **Purpose**: View past invoices and payments
- **Key Components**:
  - Invoice list with dates and amounts
  - Download invoice buttons
  - Payment method information
  - Transaction status

#### 3.6.4 Payment Methods (`/dashboard/billing/payment`)
- **Purpose**: Manage payment information
- **Key Components**:
  - Current payment method display
  - Add new payment method
  - Update existing method
  - Billing address management

### 3.7 Settings & Configuration

#### 3.7.1 Account Settings (`/dashboard/settings`)
- **Purpose**: User account preferences
- **Key Components**:
  - User profile information
  - Password change form
  - Profile picture upload
  - Account deletion option

#### 3.7.2 Notification Settings (`/dashboard/settings/notifications`)
- **Purpose**: Configure notification preferences
- **Key Components**:
  - Email notification toggles
  - Usage alert preferences
  - System update notifications
  - Notification frequency settings

#### 3.7.3 API Access (`/dashboard/settings/api`) *[Future Feature]*
- **Purpose**: Manage API keys and access
- **Key Components**:
  - API key generation
  - Rate limit information
  - API documentation links
  - Usage statistics

#### 3.7.4 Security Settings (`/dashboard/settings/security`)
- **Purpose**: Account security configuration
- **Key Components**:
  - Two-factor authentication setup
  - Active sessions management
  - Login history
  - Security alerts

---

## 4. Additional Screens

### 4.1 Error & Status Pages

#### 4.1.1 404 Not Found (`/404`)
- **Purpose**: Handle invalid URLs
- **Key Components**:
  - Error message
  - Navigation links
  - Search functionality

#### 4.1.2 500 Server Error (`/error`)
- **Purpose**: Handle server errors
- **Key Components**:
  - Error message
  - Retry button
  - Support contact information

#### 4.1.3 Maintenance Mode (`/maintenance`)
- **Purpose**: Display during system maintenance
- **Key Components**:
  - Maintenance message
  - Expected completion time
  - Status updates

### 4.2 Loading & Transition States

#### 4.2.1 Loading Screens
- **Purpose**: Show during content loading
- **Key Components**:
  - Skeleton loaders
  - Progress indicators
  - Loading animations

#### 4.2.2 Empty States
- **Purpose**: Show when no content is available
- **Key Components**:
  - Empty state illustrations
  - Call-to-action buttons
  - Helpful guidance text

### 4.3 Modal & Overlay Screens

#### 4.3.1 Confirmation Modals
- **Purpose**: Confirm destructive actions
- **Examples**: Delete knowledge entry, cancel subscription
- **Key Components**:
  - Confirmation message
  - Action buttons (Confirm/Cancel)
  - Warning indicators

#### 4.3.2 Onboarding Tour
- **Purpose**: Guide new users through dashboard features
- **Key Components**:
  - Step-by-step overlays
  - Feature highlights
  - Progress indicators
  - Skip option

---

## 5. Screen Organization Summary

### 5.1 Public Screens (Marketing Website)
**Total: 8 screens**
- Landing, Pricing, Features, About, Contact
- Terms, Privacy, Documentation

### 5.2 Authentication Screens
**Total: 8 screens**
- Sign Up, Email Verification, Plan Selection, Payment
- Login, Forgot Password, Reset Password, Account Setup

### 5.3 Dashboard Screens (Protected)
**Total: 20+ screens**
- Dashboard Overview + Layout
- Company Management (2 screens)
- Bot Configuration (3 screens)
- Knowledge Base (4 screens)
- Analytics (3 screens)
- Billing (4 screens)
- Settings (4 screens)

### 5.4 Additional Screens
**Total: 6+ screens**
- Error pages (3)
- Loading states
- Modals and overlays

---

## 6. Development Priority

### 6.1 Phase 1 (MVP) - Essential Screens
1. Landing Page
2. Sign Up/Login Flow
3. Dashboard Overview
4. Bot Configuration
5. Knowledge Base Management
6. Basic Analytics
7. Billing Overview

### 6.2 Phase 2 - Enhanced Features
1. Detailed Analytics
2. Advanced Settings
3. Team Management
4. Enhanced Knowledge Base

### 6.3 Phase 3 - Advanced Features
1. API Access
2. White-label Options
3. Advanced Customization
4. Marketplace Integration

---

## 7. Technical Considerations

### 7.1 Responsive Design
- All screens must be mobile-first responsive
- Tablet and desktop optimizations
- Touch-friendly interactions

### 7.2 Performance Requirements
- Page load times < 2 seconds
- Lazy loading for heavy content
- Optimistic UI updates

### 7.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

---

*This comprehensive screen list serves as the complete development roadmap for the UI implementation based on the PRD requirements.*