# CleanMail 📧

A modern, powerful Gmail management application built with Next.js 14, designed to help you efficiently organize, search, and clean up your Gmail inbox with advanced bulk operations and comprehensive search capabilities.

## 🌟 Features

### 📬 Email Management
- **Gmail Integration**: Full Gmail API integration with OAuth2 authentication
- **Real-time Email Loading**: Fetch emails with customizable pagination (5-1000 emails per page)
- **Advanced Search**: Comprehensive Gmail search syntax support with 25+ query examples
- **Bulk Operations**: Select and delete multiple emails simultaneously
- **Auto-refresh**: Tables automatically update after operations

### 🔍 Advanced Search & Filtering
- **Quick Search Buttons**: One-click access to common searches (Unread, Starred, With Files, Last Week)
- **Categorized Query Examples**: 
  - Common searches (unread, starred, attachments)
  - Sender/recipient filtering
  - Content-based searches with Boolean operators
  - Date range and time-based queries
  - Advanced size and label filtering
- **Interactive Search Help**: Comprehensive search guide with tabs and examples
- **Boolean Logic**: Support for OR, AND, exclusion (-), and parentheses grouping

### 💪 Bulk Operations
- **Multi-select**: Select individual emails or use "Select All" functionality
- **Bulk Delete**: Delete multiple emails concurrently with progress tracking
- **Smart Error Handling**: Graceful handling of partial failures in bulk operations
- **Selection Counter**: Real-time display of selected email count

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Theme toggle support
- **Loading States**: Comprehensive loading and error states
- **Virtualized Tables**: Efficient handling of large email datasets
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🛡️ Authentication & Security
- **OAuth2 Security**: Secure Google OAuth2 integration
- **Token Management**: Automatic token refresh with error handling
- **Session Management**: Persistent login with secure session handling
- **Comprehensive Logging**: Detailed error logging and debugging information

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Powerful table management
- **Zustand** - State management for pagination
- **nuqs** - URL state synchronization

### Backend Integration
- **Gmail API** - Google Gmail API v1
- **NextAuth.js v5** - Authentication framework
- **Google OAuth2** - Secure authentication provider

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **Zod** - Runtime type validation
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes
│   │   └── dashboard/           # Main dashboard
│   └── api/                     # API routes
│       ├── auth/                # Authentication endpoints
│       └── (google)/            # Gmail API endpoints
├── components/ui/               # Reusable UI components
│   ├── badge.tsx               # Badge component
│   ├── button.tsx              # Button variants
│   ├── data-table.tsx          # Virtualized table
│   ├── dialog.tsx              # Modal dialogs
│   ├── input.tsx               # Form inputs
│   ├── label.tsx               # Form labels
│   ├── popover.tsx             # Popover menus
│   ├── search-help.tsx         # Advanced search guide
│   ├── search-input.tsx        # Search input with clear
│   ├── select.tsx              # Dropdown selects
│   └── tabs.tsx                # Tabbed interfaces
├── features/                   # Feature-based components
│   ├── common/                 # Shared components
│   └── dashboard/              # Dashboard-specific
│       ├── email-data-table.tsx    # Main email table
│       └── email-table-columns.tsx # Table column definitions
├── lib/                        # Core utilities
│   ├── auth.ts                 # Authentication config
│   └── utils.ts                # Helper functions
├── providers/                  # Context providers
├── schemas/                    # Zod validation schemas
└── store/                      # Zustand stores
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- Google Cloud Project with Gmail API enabled
- Gmail account for testing

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CleanMail
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Variables**
   Create `.env.local` and configure:
   ```env
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # NextAuth Configuration
   AUTH_SECRET=your_nextauth_secret  # Generate: npx auth secret
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Google Cloud Setup**
   - Create a Google Cloud Project
   - Enable Gmail API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`

## 🏃‍♂️ Development

```bash
# Start development server
bun run dev
# or
npm run dev

# Build for production
bun run build
npm run build

# Start production server
bun run start
npm run start

# Run linting
npm run lint
```

## 📊 API Endpoints

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication handling

### Gmail Integration
- `GET /api/gmail/[id]` - Fetch emails with pagination
  - Query params: `q` (search), `maxResults` (5-1000)
- `DELETE /api/gmail/messages/[messageId]` - Delete specific email
- `POST /api/gmail/messages/[messageId]` - Alternative delete endpoint

## 🎯 Usage

### Basic Email Management
1. **Login**: Authenticate with your Google account
2. **Browse**: View emails with customizable page sizes (5-1000)
3. **Search**: Use advanced Gmail search syntax
4. **Delete**: Remove individual emails or bulk delete multiple

### Advanced Search Examples
- `is:unread` - Show unread emails
- `from:example@gmail.com` - Emails from specific sender
- `has:attachment size:larger_than:10M` - Large attachments
- `newer_than:7d is:important` - Recent important emails
- `(from:boss OR from:manager) -meeting` - Emails from leadership, excluding meetings

### Bulk Operations
1. Select emails using checkboxes
2. Use "Select All" for page-wide selection
3. Click bulk delete button
4. Monitor progress with real-time feedback

## 🔍 Gmail Search Syntax Reference

The application supports full Gmail search syntax with these categories:

### Common Searches
- `is:unread`, `is:starred`, `is:important`
- `has:attachment`, `in:spam`, `in:trash`

### Sender/Recipient
- `from:email@domain.com`, `to:email@domain.com`
- `cc:email@domain.com`, `from:(@domain.com)`

### Content Filtering  
- `subject:keyword`, `"exact phrase"`
- `keyword OR alternative`, `include -exclude`
- `filename:pdf`, `filename:document.docx`

### Date & Time
- `newer_than:7d`, `older_than:1m`, `newer_than:1y`
- `after:2024/01/01`, `before:2024/12/31`
- `after:2024/01/01 before:2024/01/31`

### Advanced Filters
- `size:larger_than:10M`, `size:smaller_than:1M`
- `label:work`, `deliveredto:alias@gmail.com`

## 🛠️ Recent Enhancements

### Comprehensive Error Logging
- Added detailed console logging throughout the application
- Request/response tracking with timestamps
- Authentication flow monitoring
- Error handling with stack traces

### Enhanced Search Capabilities
- Comprehensive search help with 25+ examples
- Categorized query examples in tabbed interface
- Quick search buttons for common queries
- Boolean logic support and advanced syntax

### Bulk Delete Functionality
- Multi-select email management
- Concurrent deletion with progress tracking
- Graceful error handling for partial failures
- Auto-refresh after successful operations

### Improved User Experience
- Graceful handling of empty search results
- Better error messages and recovery options
- Responsive design improvements
- Loading states and user feedback

### Scalability Improvements
- Support for up to 1000 emails per page
- Virtualized table for performance
- Efficient state management
- URL state persistence

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**
- Verify Google Cloud credentials
- Check OAuth consent screen configuration
- Ensure redirect URIs are correct

**API Rate Limits**
- Gmail API has quotas - monitor console for rate limit errors
- Reduce maxResults for faster responses
- Implement exponential backoff for retries

**Search Returns No Results**
- Application gracefully handles empty results
- Use "Clear Search" button to reset
- Try broader search terms

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gmail API** for email access
- **NextAuth.js** for authentication
- **shadcn/ui** for component library
- **TanStack** for Query and Table libraries
- **Radix UI** for accessible primitives

---

**Built with ❤️ using Next.js 14 and modern React patterns**

