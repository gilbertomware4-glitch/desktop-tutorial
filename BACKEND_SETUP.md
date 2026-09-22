# Shared online backend

The public GitHub Pages site currently stores demo likes, saves, and discussions in each browser. `supabase-schema.sql` defines the shared online data model for Incheck Talk.

## Setup

1. Sign in at https://supabase.com/dashboard with the GitHub account that owns this project.
2. Create a new project named `incheck-talk`.
3. Open **SQL Editor**, paste `supabase-schema.sql`, and run it.
4. Open **Project Settings > API** and copy the project URL and public anon key.
5. Add those public values to the frontend integration when the Supabase client is connected.

Only the project URL and public anon key belong in the browser. Never publish a service-role key. M-Pesa Daraja credentials and payment verification must run in a secure serverless function, not in GitHub Pages.

## Payment path

Use a serverless endpoint to create an M-Pesa STK Push, verify the callback, and insert a `payment_events` row with status `paid`. The frontend should only call that endpoint and display the result.
