# Eagle Courier

## UI update (Tailwind + shadcn)

This project has been updated with a modern dashboard layout and new reusable UI components.

To enable Tailwind and shadcn locally, run:

```bash
# install Tailwind and supporting packages
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# optional: install shadcn/ui and Radix if you want the full component kit
# npm install @radix-ui/react-icons @radix-ui/react-dropdown-menu
```

After installing, run the development server:

```bash
npm run dev
```

The new components live in `components/` and the dashboard layout is in `app/dashboard/layout.tsx`.

# Eagle Courier Management

Branch-based courier and cargo management system built with Next.js, Prisma ORM, and PostgreSQL.

## Features

- Public package tracking by code or QR URL.
- Staff login and dashboard.
- Package registration with sender, receiver, branch route, package type, and description.
- Privilege-based authentication for branch service providers, accountants, and super admins.
- Package pricing on registration, receipts, and financial reports.
- Automatic tracking codes like `EAG-KGL-2026-000245`.
- QR receipt generation for `/track/[trackingCode]`.
- Movement history for registered, dispatched, arrived, and delivered events.
- Receiver national ID verification before delivery.
- Accountant financial reports by branch and period, with print and CSV download.
- Super admin branch and user management.
- Public tracking masks sensitive customer data.

## Local Setup

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
npm install
```

On Windows PowerShell, use this if script execution blocks `npm`:

```bash
npm.cmd install
```

4. Create tables and seed demo data:

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

After pulling later schema changes into an existing local database, run:

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Login

- Super admin: `admin@eaglecourier.rw` / `password123`
- Service provider: `staff.kigali@eaglecourier.rw` / `password123`
- Accountant: `accountant@eaglecourier.rw` / `password123`

Seed tracking code:

- `EAG-KGL-2026-000245`

## Main Routes

- `/` public homepage with tracking search.
- `/track/[code]` public tracking timeline.
- `/login` staff login.
- `/dashboard` staff/admin overview.
- `/dashboard/packages/new` register a package.
- `/dashboard/packages` search and manage packages.
- `/dashboard/reports` financial reports for accountants and super admins.
- `/dashboard/admin` branch and staff management.
