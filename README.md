# 🏦 Horizon Banking Management System

A modern, full-stack banking management application built with Next.js 14, TypeScript, and Tailwind CSS. This application allows users to manage multiple bank accounts, view transactions, transfer funds securely, and track their financial activities in real-time.

![TypeScript](https://img.shields.io/badge/TypeScript-93.1%25-blue)
![CSS](https://img.shields.io/badge/CSS-5.4%25-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-1.5%25-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

> 🎓 **For Students & Learning:**  
> This project includes a `.env.sample` file with **working sandbox credentials**!  
> Just run `cp .env.sample .env` and start immediately - no API key signup required. 🚀  
> Perfect for learning, practice, and educational projects.

---

## 🚀 Quick Deploy to Vercel

**Ready to deploy?** Choose your guide:

| Guide | Time | Best For |
|-------|------|----------|
| 📖 [**VERCEL_DEPLOYMENT_GUIDE.md**](./VERCEL_DEPLOYMENT_GUIDE.md) | 15 min | First-time deployment (Recommended) |
| ⚡ [**QUICK_DEPLOY.md**](./QUICK_DEPLOY.md) | 5 min | Experienced users |
| ✅ [**DEPLOYMENT_CHECKLIST.md**](./DEPLOYMENT_CHECKLIST.md) | - | Track progress |
| 🎯 [**START_DEPLOYMENT_HERE.md**](./START_DEPLOYMENT_HERE.md) | - | Choose your path |

**Performance Optimized:** 2-20x faster with caching, parallelization, and HTTP keep-alive! 🔥  
Read: [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md)

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user authentication with Appwrite
- Protected routes and session management
- Bank-level security standards

### 💳 Multi-Bank Integration
- Connect multiple bank accounts via Plaid API
- Real-time account balance synchronization
- Support for checking, savings, and other account types

### 💸 Fund Transfers
- Secure peer-to-peer money transfers via Dwolla
- Transfer between your own accounts
- Send money to other users using shareable IDs
- Real-time transfer status tracking

### 📊 Transaction Management
- View complete transaction history
- Filter transactions by bank account
- Categorized transactions (Travel, Food, Payment, etc.)
- Real-time transaction updates

### 📈 Financial Dashboard
- Visual representation of account balances with charts
- Total balance across all accounts
- Recent transactions overview
- Account-wise balance breakdown

### 💰 Budget Tracking
- Set custom budgets for different categories
- Track spending against budgets
- Visual progress indicators

### 📱 Responsive Design
- Mobile-first responsive interface
- Seamless experience across all devices
- Progressive Web App capabilities

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Reusable component library
- **Chart.js** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Services
- **Appwrite** - Backend server & database
- **Plaid API** - Bank account integration
- **Dwolla API** - Payment processing
- **Sentry** - Error tracking & monitoring

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Appwrite account and project
- Plaid account (sandbox or development)
- Dwolla account (sandbox or production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MdAlaminAhmed/horizon-banking-management.git
   cd horizon-banking-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   ### 🎓 For Students/Practice (Quick Start):
   
   **Easy way** - Use the provided sample with working sandbox credentials:
   ```bash
   # Copy the sample file (includes working credentials)
   cp .env.sample .env
   
   # That's it! Ready to run immediately 🚀
   ```
   
   The `.env.sample` file includes working sandbox credentials for:
   - ✅ Appwrite (cloud database)
   - ✅ Plaid (sandbox banking API)
   - ✅ Dwolla (sandbox payments)
   
   **No API key signup needed - perfect for learning!**
   
   ---
   
   ### 🏢 For Production/Your Own Project:
   
   Get your own API credentials and create a `.env` file:

   ```env
   # Next.js
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Appwrite
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_USER_COLLECTION_ID=your_user_collection_id
   APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
   APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id
   APPWRITE_SECRET=your_appwrite_secret

   # Plaid
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=auth,transactions,identity
   PLAID_COUNTRY_CODES=US,CA

   # Dwolla
   DWOLLA_KEY=your_dwolla_key
   DWOLLA_SECRET=your_dwolla_secret
   DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
   DWOLLA_ENV=sandbox

   # Sentry (Optional)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_DSN=your_sentry_dsn
   ```
   
   **Get your credentials from:**
   - [Appwrite Console](https://cloud.appwrite.io)
   - [Plaid Dashboard](https://dashboard.plaid.com)
   - [Dwolla Dashboard](https://dashboard.dwolla.com)

4. **Set up Appwrite Database**

   Create the following collections in your Appwrite database:
   - `users` - User information
   - `banks` - Connected bank accounts
   - `transactions` - Transaction records

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
horizon-banking-management/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/              # Main application pages
│   │   ├── page.tsx         # Dashboard
│   │   ├── my-banks/        # Bank accounts page
│   │   ├── payment-transfer/ # Transfer funds page
│   │   └── transaction-history/ # Transaction history
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── AuthForm.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                     # Utility functions and actions
│   ├── actions/             # Server actions
│   │   ├── user.actions.ts
│   │   ├── bank.actions.ts
│   │   ├── transaction.actions.ts
│   │   └── dwolla.actions.ts
│   ├── utils/               # Helper functions
│   ├── appwrite.ts          # Appwrite configuration
│   └── plaid.ts             # Plaid configuration
├── public/                  # Static assets
│   └── icons/               # SVG icons
├── types/                   # TypeScript type definitions
├── .env                     # Environment variables
└── package.json             # Dependencies and scripts
```

## 🎯 Key Features Explained

### Authentication Flow
1. User signs up with email, password, and personal information
2. Account is created in both Appwrite and Dwolla
3. Secure session is established
4. User can access protected routes

### Bank Account Connection
1. User clicks "Add Bank" 
2. Plaid Link modal opens
3. User selects their bank and logs in
4. Bank account is connected and synced
5. Account details and transactions are fetched

### Fund Transfer Process
1. User selects source bank account
2. Enters recipient's shareable ID
3. Specifies transfer amount and note
4. Transfer is processed via Dwolla
5. Transaction is recorded in database
6. Both sender and recipient see updated balances

### Real-time Updates
- Server actions with `revalidatePath()` ensure fresh data
- Transactions update immediately after transfer
- Dashboard refreshes automatically

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run format       # Format code with Prettier

# Maintenance
npm run audit:fix    # Fix security vulnerabilities
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables
   - Deploy

3. **Configure Environment Variables**
   
   Add all variables from your `.env` file to Vercel's environment settings.

4. **Update Service URLs**
   - Add your Vercel URL to Appwrite's allowed origins
   - Update Plaid redirect URI with your Vercel URL
   - Update Dwolla allowed origins if needed

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🔒 Security Considerations

- All sensitive data is encrypted
- API keys are stored securely in environment variables
- Bank credentials are never stored - handled by Plaid
- Dwolla provides secure payment processing
- HTTPS is enforced in production
- Session tokens are HTTP-only cookies

## 🐛 Troubleshooting

### Common Issues

**Issue:** "ADDITIONAL_CONSENT_REQUIRED" error from Plaid
- **Solution:** Re-link your bank account and ensure transactions scope is granted

**Issue:** Dwolla funding source creation fails
- **Solution:** Verify your Dwolla credentials and ensure the bank account type is supported

**Issue:** Transactions not appearing after transfer
- **Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

**Issue:** "No session" error
- **Solution:** Log out and log back in to refresh your session

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Md. Al-Amin Ahmed - [@MdAlaminAhmed](https://github.com/MdAlaminAhmed)

Project Link: [https://github.com/MdAlaminAhmed/horizon-banking-management](https://github.com/MdAlaminAhmed/horizon-banking-management)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Plaid API Documentation](https://plaid.com/docs/)
- [Dwolla API Documentation](https://developers.dwolla.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

---

⭐ If you found this project helpful, please consider giving it a star!
