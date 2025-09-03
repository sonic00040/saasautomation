import os
from supabase import create_client, Client

# It's recommended to use environment variables for these
SUPABASE_URL = "https://rjvvkfecdrdxmnxwiuto.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
