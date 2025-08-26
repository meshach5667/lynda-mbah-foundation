# Database Migration: Supabase to SQLite

This guide will help you migrate your Lynda Mbah Foundation application from Supabase to SQLite.

## Overview

The application now supports both Supabase and SQLite databases, with SQLite as the default. This provides several benefits:

- **No external dependencies**: Your data is stored locally in a SQLite file
- **Better performance**: Faster queries for local development and small deployments
- **Cost savings**: No monthly Supabase fees
- **Offline capability**: Works without internet connection
- **Simplified deployment**: No need to configure external database credentials

## Migration Steps

### 1. Install Dependencies

The SQLite dependencies should already be installed, but if needed:

```bash
npm install better-sqlite3 @types/better-sqlite3
```

### 2. Environment Configuration

The application uses environment variables to determine which database to use:

- Create or update your `.env` file:

```env
# Set to 'false' to use SQLite (default), 'true' to use Supabase
VITE_USE_SUPABASE=false

# Supabase credentials (only needed if VITE_USE_SUPABASE=true)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Migration Options

#### Option A: Fresh Start (Recommended)

If you don't have existing data or want to start fresh:

1. Set `VITE_USE_SUPABASE=false` in your `.env` file
2. Delete any existing SQLite database: `rm db/database.sqlite` (if it exists)
3. Start the application: `npm run dev`
4. The SQLite database will be created automatically with demo data

#### Option B: Migrate Existing Data

If you have existing data in Supabase that you want to keep:

1. Make sure your Supabase credentials are in your environment:
   ```bash
   export VITE_SUPABASE_URL="your_supabase_url"
   export VITE_SUPABASE_ANON_KEY="your_supabase_key"
   ```

2. Run the migration script:
   ```bash
   npm run migrate:supabase-to-sqlite
   ```

3. Update your `.env` file to use SQLite:
   ```env
   VITE_USE_SUPABASE=false
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

### 4. Database File Location

Your SQLite database will be created at:
```
db/database.sqlite
```

**Important**: Make sure to backup this file regularly and include it in your deployment process.

## Database Schema

The SQLite schema includes all the same tables as your Supabase setup:

- `projects` - Fundraising projects
- `donations` - Donation records
- `contact_messages` - Contact form submissions

## Development vs Production

### Development
- SQLite file is stored locally
- Perfect for development and testing
- No internet connection required

### Production Deployment

For production deployment, you have several options:

1. **Single Server Deployment**: Include the SQLite file in your deployment
2. **Static Hosting**: For read-only sites, pre-build the data
3. **Hybrid Approach**: Use SQLite for some features, external APIs for others

## API Compatibility

The application maintains the same API interface regardless of which database you use. The `supabase.ts` file automatically routes calls to either the Supabase client or the SQLite client based on your environment configuration.

## Troubleshooting

### SQLite File Permissions
Make sure the `db/` directory and SQLite file have proper read/write permissions:
```bash
chmod 755 db/
chmod 644 db/database.sqlite
```

### Migration Errors
If the migration script fails:
1. Check your Supabase credentials
2. Ensure you have internet connectivity
3. Verify the Supabase project is accessible
4. Check the console output for specific error messages

### Performance Considerations
SQLite performs well for most use cases, but for high-traffic applications:
- Consider using WAL mode (already enabled)
- Add appropriate indexes (already included)
- Monitor file size and implement archiving if needed

## Switching Back to Supabase

If you need to switch back to Supabase:
1. Set `VITE_USE_SUPABASE=true` in your `.env` file
2. Add your Supabase credentials
3. Restart the application

## File Structure

After migration, your project structure will include:

```
db/
├── schema.sql          # SQLite schema definition
├── seed.sql           # Demo data
└── database.sqlite    # Your actual database file

scripts/
└── migrate-supabase-to-sqlite.js  # Migration utility

src/lib/
├── database.ts        # SQLite database operations
├── sqlite-client.ts   # Supabase-compatible SQLite client
└── supabase.ts       # Database abstraction layer
```

## Backup Strategy

Remember to backup your SQLite database regularly:

```bash
# Create a backup
cp db/database.sqlite db/database.backup.$(date +%Y%m%d_%H%M%S).sqlite

# Or use SQLite backup command for consistency
sqlite3 db/database.sqlite ".backup db/backup.sqlite"
```

## Support

If you encounter issues during migration, check:
1. Node.js version compatibility (>=18 recommended)
2. File system permissions
3. Available disk space
4. Console error messages

The migration preserves all your existing data while providing a more independent and cost-effective solution.
