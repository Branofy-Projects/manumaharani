# FIX THE DATABASE ERROR - DO THIS NOW

## Option 1: Run SQL Directly (FASTEST - 30 seconds)

1. Open your database (Neon dashboard, Supabase SQL editor, or psql)
2. Copy and paste this ENTIRE block:

```sql
ALTER TABLE "room_types" DROP CONSTRAINT IF EXISTS "room_types_resort_id_resort_id_fk";
ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "rooms_resort_id_resort_id_fk";
ALTER TABLE "gallery" DROP CONSTRAINT IF EXISTS "gallery_resort_id_resort_id_fk";
ALTER TABLE "testimonials" DROP CONSTRAINT IF EXISTS "testimonials_resort_id_resort_id_fk";
ALTER TABLE "room_types" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "rooms" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "gallery" ALTER COLUMN "resort_id" DROP NOT NULL;
ALTER TABLE "testimonials" ALTER COLUMN "resort_id" DROP NOT NULL;
```

3. Click RUN/EXECUTE
4. Done! Try creating a room type again.

## Option 2: Use Drizzle Push

```bash
yarn workspace @repo/db db:push
```

## Option 3: Use the Fix Action (if you have API access)

Call the `fixDatabaseSchema` action from your code.

---

**WHY THIS ERROR HAPPENS:**
- Your database still requires `resort_id` to be NOT NULL
- Your code no longer provides `resort_id`
- The database rejects the insert because it's missing a required field

**THE FIX:**
- Remove the NOT NULL constraint from `resort_id` columns
- This allows the database to accept NULL values (which is what your code sends)

