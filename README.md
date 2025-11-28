# DukeFarm Admin Dashboard

> Next.js admin dashboard for DukeFarm catfish production management platform

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: React Hot Toast
- **API**: RESTful (Backend integration)

## 🔌 API Integration

### Configuration

API URL is hardcoded in `src/services/api/config.ts`:
```typescript
baseURL: 'https://dukefarm-backend.onrender.com/api'
```

### Services Structure

```
services/api/
├── config.ts         # API base URL & utilities
├── types.ts          # TypeScript interfaces
├── client.ts         # HTTP client (GET/POST/PUT/DELETE)
├── feedFormulas.ts   # Feed formulas CRUD
└── index.ts          # Public exports
```

### Usage Example

```typescript
import { feedFormulasAPI } from '@/services/api';

// List with pagination
const response = await feedFormulasAPI.list({ page: 1, limit: 10 });

// Create new formula
await feedFormulasAPI.create({
  name: "สูตรลูกปลา",
  targetStage: "อายุ 15-40 วัน",
  description: "...",
  recommendations: "..."
});

// Update & Delete
await feedFormulasAPI.update(id, data);
await feedFormulasAPI.delete(id);
```

### Error Handling

```typescript
try {
  await feedFormulasAPI.create(data);
} catch (error) {
  if (error instanceof APIError) {
    // Handle: 400, 404, 500, etc.
    toast.error(error.message);
  }
}
```

## 🎯 Features

### Feed Formulas Management (สูตรอาหาร)
- ✅ List with pagination & search
- ✅ Create new formula
- ✅ View formula details
- ✅ Edit existing formula
- ✅ Delete formula
- ✅ Auto-refresh after mutations

### Admin Features
- Admin user management
- Role-based access control
- Permission management

### Farmer Management
- Farmer profiles
- Farm information
- Dashboard analytics

### Researcher Tools
- Survey management
- Data collection
- Research analytics

## 🔐 Authentication

**Note**: Authentication is currently disabled for development.

To re-enable:
1. Uncomment auth injection in `src/services/api/client.ts`
2. Add token checks in components
3. Implement login flow

## 📦 Dependencies

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "react-hot-toast": "^2.x"
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌐 Environment

No environment variables required. API URL is hardcoded.

For production, consider using:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.dukefarm.com
```

## 📝 API Data Mapping

| API Field | Frontend Field | Type |
|-----------|---------------|------|
| `id` | `id` | UUID |
| `name` | `name` | string |
| `targetStage` | `ageRange` | string |
| `description` | `description` | string |
| `recommendations` | `recommendations` | string |

## 🐛 Troubleshooting

**Build Error**: Clear `.next` folder and rebuild
```bash
rm -rf .next
npm run build
```

**Type Errors**: Restart TypeScript server in VS Code
```
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

**API Connection**: Check backend status at `/api/v1/health`

## 📚 Related Projects

- [DukeFarm Backend](../DukeFarm-Backend) - Node.js API server
- [DukeFarm Farmer App](../Dukefram) - Farmer mobile interface

## 📄 License

Proprietary - © 2025 DukeFarm
