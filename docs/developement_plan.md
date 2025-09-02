# SaaS MVP Development Plan

This document outlines the phased approach for building the Minimum Viable Product (MVP) of the SaaS platform.

---

## Phase 1: Database Foundation
**Goal:** Establish the initial database schema to support multi-tenancy, subscription logic, and usage tracking.

### 1.1 Companies Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **name**: TEXT (not null)
- **email**: TEXT (unique, not null)
- **telegram_bot_token**: TEXT (unique, nullable)
- **whatsapp_identifier**: TEXT (unique, nullable)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 1.2 Plans Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **name**: TEXT (not null)
- **price**: NUMERIC (not null)
- **token_limit**: BIGINT (not null)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 1.3 Subscriptions Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **company_id**: UUID (FK → `companies.id`, cascade on delete)
- **plan_id**: UUID (FK → `plans.id`)
- **start_date**: TIMESTAMPTZ (not null)
- **end_date**: TIMESTAMPTZ (not null)
- **is_active**: BOOLEAN (default `true`)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 1.4 Usage Logs Table
- **id**: BIGSERIAL (PK)
- **subscription_id**: UUID (FK → `subscriptions.id`, cascade on delete)
- **total_tokens**: INT (not null)
- **timestamp**: TIMESTAMPTZ (default `now()`)

### 1.5 Function: get_total_usage
- **Inputs**:
  - `p_subscription_id`: UUID  
  - `p_start_date`: TIMESTAMPTZ  
  - `p_end_date`: TIMESTAMPTZ  
- **Returns**: INT (sum of token usage, defaults to 0 if no records found)

---

## Phase 2: Backend Logic Implementation
**Goal:** Implement the core SaaS logic for usage metering and limit enforcement.

### 2.1 Tenant Identification
- Update `handle_message` function to identify the company using `telegram_bot_token`.

### 2.2 Usage Metering
- Update `rag_service` to count tokens used in `generate_response_with_llm`.
- Create **UsageService** with:
  - `record_usage`: Logs tokens in `usage_logs` after each API call.

### 2.3 Limit Enforcement
- In **UsageService**:
  - `check_usage`: Calculates total tokens for current billing cycle.
- In `handle_message`:
  - Call `check_usage` before processing.
  - If usage exceeds plan limit → return "limit reached" message and stop.

---

## Phase 3: Frontend MVP - Dashboard
**Goal:** Build the minimum viable dashboard for clients to manage their service.

### 3.1 Project Setup
- Initialize a new React application.

### 3.2 User Authentication
- Implement registration and login (via Supabase Auth).

### 3.3 Company & Channel Configuration
- UI for onboarding flow (create company, select plan, submit channel credentials).
- Example: Form to enter **Telegram Bot Token**.

### 3.4 Usage Dashboard
- Display current plan and token usage for billing cycle.
- Fetch usage data from API endpoint exposing `usage_logs`.

### 3.5 Knowledge Base Management
- UI for uploading and managing knowledge base documents.

---

## Phase 4: Future Development
**Goal:** Plan for post-MVP premium features.

### 4.1 Premium Features
- Analytics  
- Integrations  
- Customization options  

### 4.2 Payment Integration
- Integrate Stripe for subscription billing automation.

### 4.3 Testing & Deployment
- End-to-end testing of platform.
- Deploy backend and frontend apps.