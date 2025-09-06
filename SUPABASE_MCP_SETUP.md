# Supabase MCP Integration with Claude Code

This guide shows how to connect Claude Code to your Supabase project using the official Supabase MCP server.

## Prerequisites

- Node.js 22+ installed
- A Supabase project
- Claude Code installed

## Step 1: Create Supabase Personal Access Token

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Click on your profile icon (top right)
3. Go to **"Access Tokens"** 
4. Click **"Generate new token"**
5. Give it a descriptive name like `"Claude MCP Integration"`
6. Click **"Generate token"**
7. **Copy the token immediately** - you won't be able to see it again

## Step 2: Get Your Project Reference

1. In your Supabase project dashboard
2. Go to **Settings > General**
3. Copy your **Project Reference ID** (looks like `abcdefghijklmnop`)

## Step 3: Configure Environment Variables

1. Copy the template file: `cp .env.template .env`
2. Edit `.env` and add your actual values:

```bash
SUPABASE_ACCESS_TOKEN=sbp_1234567890abcdef...
SUPABASE_PROJECT_REF=abcdefghijklmnop
```

## Step 4: Verify Configuration Files

The following files have been created for you:

**`.claude/config.json`** - Claude Code MCP configuration:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=${SUPABASE_PROJECT_REF}"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

**`.gitignore`** - Prevents committing secrets to git

## Security Best Practices

- ✅ Use `--read-only` flag to prevent accidental data modification
- ✅ Use `--project-ref` to limit access to specific project only
- ✅ Test on development projects first, not production
- ✅ Store tokens in environment variables, not in config files
- ✅ Use Personal Access Tokens instead of service role keys

## What You Can Do

Once configured, you can ask Claude to:
- Query your database tables
- Fetch project configuration
- Analyze your database schema
- Generate SQL queries
- Manage database migrations (if read-only is disabled)

## Next Steps

1. **Set up your credentials**: Follow steps 1-3 above to get your tokens and configure `.env`
2. **Restart Claude Code** after setting up the configuration
3. **Test the connection** by asking Claude: "What tables do I have in my Supabase database?"

## Troubleshooting

- Ensure Node.js 22+ is installed: `node --version`
- Verify your access token has the correct permissions
- Check that your project reference ID is correct
- Make sure `.env` file is in the project root and properly formatted
- Restart Claude Code after making configuration changes
- If MCP server fails to start, check the Claude Code logs for error messages

## Files Created

- `SUPABASE_MCP_SETUP.md` - This setup guide
- `.claude/config.json` - Claude Code MCP server configuration  
- `.env.template` - Environment variables template
- `.gitignore` - Prevents committing secrets