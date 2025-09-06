# Bot Configuration - ASCII Mockup

**Route:** `/dashboard/bot`  
**Purpose:** Manage Telegram bot settings

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 BotAI          Dashboard    Knowledge    Analytics    Settings          │
│                                                                    John ▼   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dashboard > Bot Configuration                                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        Bot Configuration                                    │
│                                                                             │
│                    Manage your Telegram bot settings                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ── BOT STATUS ──                                   │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │                                     │  │                                 │ │
│  │        🟢 Bot Online                │  │       Connection Health        │ │
│  │                                     │  │                                 │ │
│  │  Status: Connected                  │  │  ████████████████░░ 94%        │ │
│  │  Last Activity: 2 minutes ago       │  │                                 │ │
│  │  Messages Today: 47                 │  │  Response Time: 0.8s avg       │ │
│  │  Uptime: 99.97% (30 days)          │  │  Success Rate: 98.2%            │ │
│  │                                     │  │  Last Error: None               │ │
│  │  ┌─────────────────────────────────┐ │  │                                 │ │
│  │  │          Test Bot Now           │ │  │  ┌─────────────────────────────┐ │ │
│  │  └─────────────────────────────────┘ │  │  │      View Error Logs       │ │ │
│  │                                     │  │  └─────────────────────────────┘ │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                        ── BOT CONFIGURATION ──                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        Bot Token Settings                               │ │
│  │                                                                         │ │
│  │  Bot Token *                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ 123456789:AAGFGg••••••••••••••••••••••••••••••••••••••••  👁️ 📋    │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  🔒 Your bot token is encrypted and secure                              │ │
│  │                                                                         │ │
│  │  Webhook URL (Auto-generated)                                           │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ https://api.botai.com/webhook/123456789                         📋   │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  📋 Copy this URL and set it as your Telegram bot webhook              │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        Bot Information                                  │ │
│  │                                                                         │ │
│  │  Bot Name: @AcmeCustomerSupportBot                                      │ │
│  │  Bot Username: acme_customer_support_bot                                │ │
│  │  Bot Description: AI-powered customer support for Acme Corp            │ │
│  │  Created: November 15, 2024                                            │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    Update Bot Information                          │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                       ── ADVANCED SETTINGS ──                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        Response Settings                                │ │
│  │                                                                         │ │
│  │  Response Timeout                                                       │ │
│  │  ┌─────────┐ seconds (default: 30)                                      │ │
│  │  │    30   │                                                            │ │
│  │  └─────────┘                                                            │ │
│  │                                                                         │ │
│  │  Maximum Message Length                                                 │ │
│  │  ┌─────────┐ characters (default: 4096)                                 │ │
│  │  │  4096   │                                                            │ │
│  │  └─────────┘                                                            │ │
│  │                                                                         │ │
│  │  Rate Limiting                                                          │ │
│  │  ┌─────────┐ messages per minute per user (default: 10)                │ │
│  │  │   10    │                                                            │ │
│  │  └─────────┘                                                            │ │
│  │                                                                         │ │
│  │  ☑️ Enable automatic responses                                          │ │
│  │  ☑️ Log all interactions                                                │ │
│  │  ☐ Enable debug mode                                                   │ │
│  │  ☑️ Send typing indicator                                               │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        Custom Responses                                 │ │
│  │                                                                         │ │
│  │  Welcome Message                                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Hello! I'm your AI assistant. How can I help you today?             │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  Error Message                                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ I'm sorry, I'm having trouble right now. Please try again later.   │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  │  No Knowledge Message                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ I don't have information about that. Please contact support at      │ │ │
│  │  │ support@acme.com or call 1-800-ACME-HELP.                          │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ── BOT TESTING ──                                  │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │                                     │  │                                 │ │
│  │           Test Interface            │  │         Recent Tests            │ │
│  │                                     │  │                                 │ │
│  │  Test Message                       │  │  ✅ 5 min ago                   │ │
│  │  ┌─────────────────────────────────┐ │  │     "What's your return policy?"│ │
│  │  │ What are your business hours?   │ │  │     Response: 0.8s              │ │
│  │  │                                 │ │  │                                 │ │
│  │  │                                 │ │  │  ✅ 15 min ago                  │ │
│  │  │                                 │ │  │     "How do I cancel my order?" │ │
│  │  │                                 │ │  │     Response: 1.2s              │ │
│  │  └─────────────────────────────────┘ │  │                                 │ │
│  │                                     │  │  ❌ 1 hour ago                   │ │
│  │  ┌─────────────────────────────────┐ │  │     "System test message"       │ │
│  │  │         Send Test Message       │ │  │     Error: Token limit exceeded │ │
│  │  └─────────────────────────────────┘ │  │                                 │ │
│  │                                     │  │  ┌─────────────────────────────┐ │ │
│  │                                     │  │  │       View All Tests        │ │ │
│  │  AI Response:                       │  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────┐ │  │                                 │ │
│  │  │ Our business hours are Monday   │ │  │                                 │ │
│  │  │ through Friday, 9 AM to 6 PM    │ │  │                                 │ │
│  │  │ EST. We're closed on weekends   │ │  │                                 │ │
│  │  │ and major holidays. For urgent  │ │  │                                 │ │
│  │  │ support outside business hours, │ │  │                                 │ │
│  │  │ please email support@acme.com.  │ │  │                                 │ │
│  │  └─────────────────────────────────┘ │  │                                 │ │
│  │                                     │  │                                 │ │
│  │  Response Time: 0.9s                │  │                                 │ │
│  │  Tokens Used: 247                   │  │                                 │ │
│  │                                     │  │                                 │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                          ── SAVE CHANGES ──                                │
│                                                                             │
│                        ┌─────────────────────────┐                        │
│                        │     Save Configuration  │                        │
│                        │                         │                        │
│                        └─────────────────────────┘                        │
│                                                                             │
│                          Changes are saved automatically                    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ── HELP & GUIDES ──                                │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │                 │  │                 │  │                 │             │
│  │ 📚 Setup Guide  │  │ 🔧 Troubleshoot │  │ 💬 Get Support  │             │
│  │                 │  │                 │  │                 │             │
│  │ Step-by-step    │  │ Common issues   │  │ Contact our     │             │
│  │ instructions    │  │ and solutions   │  │ technical       │             │
│  │ for bot setup   │  │ for bot config  │  │ support team    │             │
│  │                 │  │                 │  │                 │             │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │             │
│  │ │ View Guide  │ │  │ │   Debug     │ │  │ │ Start Chat  │ │             │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Components:

### Bot Status Section
- **Real-time status** indicator (Online/Offline)
- **Connection health** metrics with percentage
- **Activity summary**: Last activity, messages today, uptime
- **Performance metrics**: Response time, success rate, error status
- **Test Bot** quick action button
- **Error logs** access for debugging

### Bot Configuration Panel
- **Bot Token**: Masked display with reveal and copy options
- **Security notice** about encryption
- **Webhook URL**: Auto-generated, copyable for Telegram setup
- **Setup instructions** for webhook configuration

### Bot Information
- **Bot details**: Name, username, description
- **Creation date** for reference
- **Update option** for bot information

### Advanced Settings
- **Response timeout** configuration
- **Message length** limits
- **Rate limiting** per user settings
- **Feature toggles**:
  - Automatic responses
  - Interaction logging
  - Debug mode
  - Typing indicators

### Custom Responses
- **Welcome message** customization
- **Error message** templates
- **No knowledge** fallback response
- **Editable text areas** for personalization

### Bot Testing Interface
- **Left Panel**: Test message input and response display
- **Response details**: Time taken, tokens used
- **Right Panel**: Recent test history with status indicators
- **Test results** with success/failure status

### Save & Help Section
- **Save configuration** button
- **Auto-save** notification
- **Help resources**: Setup guide, troubleshooting, support

## Interactive Elements:
- **Token visibility** toggle
- **Copy buttons** for token and webhook URL
- **Real-time testing** interface
- **Form validation** for settings
- **Auto-save** functionality

## Security Features:
- **Token masking** by default
- **Encrypted storage** indicators
- **Secure webhook** generation
- **Access logging** for security audit

## Testing Features:
- **Interactive test** interface
- **Response time** measurement
- **Token usage** tracking
- **Test history** with timestamps
- **Error handling** demonstration

## Error States:
- **Connection failed** status
- **Invalid token** warnings
- **Rate limiting** exceeded
- **Test failure** indicators

## Responsive Behavior:
- Mobile: Single column, stacked panels
- Tablet: Two-column layout for testing section
- Desktop: Full layout as shown

## Real-time Features:
- **Live status** updates
- **Activity monitoring**
- **Test results** immediate display
- **Performance metrics** refresh