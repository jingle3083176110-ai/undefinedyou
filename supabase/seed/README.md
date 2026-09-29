# Supabase content seed

The initial migration creates the content tables and public-read RLS policies. Import data only through the idempotent content transfer scripts after the schema has been applied. The scripts preserve the local files and never delete local records.
