## 5. Database Schema

### 5.1 Companies Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **user_id**: UUID (FK → `auth.users.id`)
- **name**: TEXT (not null)
- **email**: TEXT (unique, not null)
- **telegram_bot_token**: TEXT (unique, nullable)
- **whatsapp_identifier**: TEXT (unique, nullable)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 5.2 Plans Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **name**: TEXT (not null)
- **price**: NUMERIC(10,2) (not null)
- **token_limit**: BIGINT (not null)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 5.3 Subscriptions Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **company_id**: UUID (FK → `companies.id`, on delete cascade)
- **plan_id**: UUID (FK → `plans.id`)
- **start_date**: TIMESTAMPTZ (not null)
- **end_date**: TIMESTAMPTZ (not null)
- **is_active**: BOOLEAN (default `true`)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 5.4 Usage Logs Table
- **id**: BIGSERIAL (PK)
- **subscription_id**: UUID (FK → `subscriptions.id`, on delete cascade)
- **total_tokens**: INT (not null)
- **timestamp**: TIMESTAMPTZ (default `now()`)

### 5.5 Knowledge Bases Table
- **id**: UUID (PK, default `gen_random_uuid()`)
- **company_id**: UUID (FK → `companies.id`, on delete cascade)
- **content**: TEXT (not null)
- **embedding**: VECTOR(1536) (requires pgvector extension)
- **created_at**: TIMESTAMPTZ (default `now()`)

### 5.6 Function: get_total_usage
- **Inputs**:
  - `p_subscription_id`: UUID
  - `p_start_date`: TIMESTAMPTZ
  - `p_end_date`: TIMESTAMPTZ
- **Returns**: INT (total token usage in date range)
- **Logic**: Sums `usage_logs.total_tokens` for the subscription within the given date range.
