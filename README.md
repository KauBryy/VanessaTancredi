# Borbiconi Real Estate App

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at [database.new](https://database.new)
2. Go to the SQL Editor in Supabase and run the content of `supabase_schema.sql` to create tables and policies.
3. Get your URL and Anon Key from Project Settings > API.
4. Rename `.env.example` to `.env` and fill in your keys:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Run Locally
```bash
npm run dev
```

### 4. Admin Access
The admin interface is at `/admin/login`.
Since we used Supabase Auth, you need to create a user in your Supabase Auth dashboard manually (or sign up if you enabled it, but for admin strictly, usually you invite a user or creating one from Supabase dashboard is safer if you disable public signups).
- Go to Authentication > Users > Add User
- Enter an email (e.g., `vanessa@borbiconi.immo`) and a password.
- Use these credentials to log in at `/admin/login`.

## Features
- **Public**: Home (Biens à la une), Detail View, Estimation, Contact.
- **Admin**: Dashboard requiring login, Add/Edit Property with Drag & Drop image upload.
