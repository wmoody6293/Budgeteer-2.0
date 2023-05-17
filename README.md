# Budgeteer-2.0

1. run npm install in the terminal, then cd into src folder
2. Prisma Install
   a. Create a db through elephantSQL and insert string into .env within src folder
   b. Just to be safe, I recommend manually adding "?schema=public" to the end of the db connection string. This should take place automatically while doing the install instructions, but to reduce potential errors I recommend just adding it.
   c. in terminal, type: npx prisma migrate dev --name init - This will create a new migration file and run the SQL migration against the db
   d. within the migrations folder, you should see a new migration SQL file with SQL tables from your schema
   e. IMPORTANT: in the terminal, run: npx prisma db push
   - This allows pushes your schema to the db, allowing you to create new tables
     f. To test the user, go to this link, and follow the instructions on the page: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgres
