# Horizon Banking Management

A modern, full-stack banking management web application built with Next.js, TypeScript, Tailwind CSS, Appwrite, Plaid, and Dwolla.

## Features
- User authentication and secure account management
- Link real or sandbox bank accounts using Plaid
- View account balances and transaction history
- Transfer funds between accounts (Dwolla integration)
- Responsive dashboard with charts and analytics
- Demo data support for presentation/testing

## Tech Stack
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Appwrite (Cloud), Node.js
- **Banking APIs:** Plaid (sandbox), Dwolla (sandbox)

## Getting Started
1. Clone the repository:
   ```sh
   git clone https://github.com/MdAlaminAhmed/horizon-banking-management.git
   cd horizon-banking-management
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in your Appwrite, Plaid, and Dwolla credentials.
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure
- `app/` — Next.js app directory (pages, layouts, API routes)
- `components/` — Reusable UI components
- `lib/` — Utility libraries and API integrations
- `constants/` — Shared constants
- `public/` — Static assets and icons
- `types/` — TypeScript type definitions

## Integrations
- **Appwrite:** User authentication, database, and storage
- **Plaid:** Bank account linking and transaction data
- **Dwolla:** ACH money transfers

## Demo Data
You can populate the dashboard with demo data for a full-featured look. See the documentation or ask for a script to automate this process.

## License
This project is licensed under the MIT License.
