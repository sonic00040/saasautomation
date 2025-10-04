#!/bin/bash
# Multi-Bot Testing Helper Script
# This script helps you test both UrbanStep and TechNova bots

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Bot tokens - Load from environment variables
# SECURITY: Never hardcode bot tokens in scripts!
# Set these in your environment or .env file before running this script
URBANSTEP_TOKEN="${URBANSTEP_BOT_TOKEN:-}"
TECHNOVA_TOKEN="${TECHNOVA_BOT_TOKEN:-}"

# Check if tokens are set
if [ -z "$URBANSTEP_TOKEN" ] || [ -z "$TECHNOVA_TOKEN" ]; then
    echo -e "${RED}❌ ERROR: Bot tokens not set in environment${NC}"
    echo -e "${YELLOW}Please set the following environment variables:${NC}"
    echo "   export URBANSTEP_BOT_TOKEN='your_urbanstep_token_here'"
    echo "   export TECHNOVA_BOT_TOKEN='your_technova_token_here'"
    echo ""
    echo -e "${YELLOW}Or add them to your .env file${NC}"
    exit 1
fi

echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║         BotAI - Multi-Bot Testing Helper                          ║"
echo "║         Test UrbanStep & TechNova Bots Simultaneously             ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}📋 This script will help you:${NC}"
echo "   1. ✅ Verify backend is running"
echo "   2. ✅ Check ngrok tunnel is active"
echo "   3. ✅ Set webhooks for both bots"
echo "   4. ✅ Provide test queries for each bot"
echo ""

# Check if backend is running
echo -e "${BOLD}Step 1: Checking Backend Server${NC}"
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running on http://localhost:8000${NC}"
else
    echo -e "${RED}❌ Backend server is NOT running${NC}"
    echo -e "${YELLOW}Please start it with:${NC}"
    echo "   cd backend && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    echo ""
    echo "Press Ctrl+C to exit, then start the backend server."
    exit 1
fi

echo ""

# Check ngrok
echo -e "${BOLD}Step 2: Checking ngrok Tunnel${NC}"
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['tunnels'][0]['public_url'] if data.get('tunnels') else '')" 2>/dev/null || echo "")

if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}❌ ngrok is NOT running${NC}"
    echo -e "${YELLOW}Please start it in a new terminal with:${NC}"
    echo "   ngrok http 8000"
    echo ""
    echo "Then run this script again."
    exit 1
else
    echo -e "${GREEN}✅ ngrok tunnel is active: ${NGROK_URL}${NC}"
fi

echo ""

# Set webhooks
echo -e "${BOLD}Step 3: Setting Webhooks${NC}"

echo -e "${BLUE}Setting webhook for UrbanStep Footwear Bot...${NC}"
python3 backend/set_telegram_webhook.py "$URBANSTEP_TOKEN" "$NGROK_URL" 2>&1 | grep -E "(success|error|Error)" || echo "Webhook command executed"

echo ""
echo -e "${BLUE}Setting webhook for TechNova Electronics Bot...${NC}"
python3 backend/set_telegram_webhook.py "$TECHNOVA_TOKEN" "$NGROK_URL" 2>&1 | grep -E "(success|error|Error)" || echo "Webhook command executed"

echo ""
echo -e "${GREEN}${BOLD}✅ Setup Complete!${NC}"
echo ""

# Display testing instructions
echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║                    HOW TO TEST YOUR BOTS                          ║${NC}"
echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}${YELLOW}🤖 UrbanStep Footwear Bot${NC}"
echo -e "${BLUE}Token:${NC} ${URBANSTEP_TOKEN:0:10}...${URBANSTEP_TOKEN: -5} (masked for security)"
echo ""
echo -e "${GREEN}Sample Questions (about footwear/shoes):${NC}"
echo "   • What products do you sell?"
echo "   • What are your shipping times?"
echo "   • Do you have sneakers or sandals?"
echo "   • What's your return policy?"
echo "   • What payment methods do you accept?"
echo "   • Where is your company located?"
echo ""
echo -e "${YELLOW}Expected: Bot responds with UrbanStep footwear information${NC}"
echo ""
echo "─────────────────────────────────────────────────────────────────────"
echo ""

echo -e "${BOLD}${YELLOW}📱 TechNova Electronics Bot${NC}"
echo -e "${BLUE}Token:${NC} ${TECHNOVA_TOKEN:0:10}...${TECHNOVA_TOKEN: -5} (masked for security)"
echo ""
echo -e "${GREEN}Sample Questions (about electronics):${NC}"
echo "   • What products do you sell?"
echo "   • What are your shipping times to Dubai?"
echo "   • Do you accept cryptocurrency payments?"
echo "   • What's your warranty policy on laptops?"
echo "   • How can I contact customer support?"
echo "   • Where is TechNova located?"
echo ""
echo -e "${YELLOW}Expected: Bot responds with TechNova electronics information${NC}"
echo ""

echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║                    MONITORING TIPS                                ║${NC}"
echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Watch the backend terminal for:${NC}"
echo "   • Incoming webhook requests"
echo "   • Company identification (UrbanStep vs TechNova)"
echo "   • AI response generation"
echo "   • Token usage logging"
echo ""
echo -e "${GREEN}✅ Verify multi-tenancy:${NC}"
echo "   • Each bot uses its own knowledge base"
echo "   • No mixing of UrbanStep and TechNova information"
echo "   • Token usage tracked separately"
echo ""
echo -e "${GREEN}✅ Check for errors:${NC}"
echo "   • Both bots should respond within 2-3 seconds"
echo "   • No error messages in backend logs"
echo "   • Responses contain company-specific details"
echo ""

echo -e "${BOLD}${YELLOW}Happy Testing! 🚀${NC}"
echo ""
