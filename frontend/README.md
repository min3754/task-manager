# Frontend Setup Guide

## Prerequisites

- Node.js v18+ installed
- Running backend server (see backend/README.md)

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configuration

The frontend is configured to proxy API requests to the backend server through Vite's proxy configuration.

**Default settings (vite.config.js):**
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

If your backend runs on a different port, update `vite.config.js` accordingly.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Navbar.css
│   │   └── TaskModal.jsx    # Task create/edit modal
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Dashboard with stats
│   │   ├── Dashboard.css
│   │   ├── Tasks.jsx        # Task list and management
│   │   ├── Tasks.css
│   │   ├── Profile.jsx      # User profile page
│   │   ├── Profile.css
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   └── Auth.css
│   ├── services/            # API service layer
│   │   └── api.js           # Axios instance and API calls
│   ├── utils/               # Utility functions
│   │   └── helpers.js       # Date formatting, status helpers
│   ├── styles/              # Global styles
│   │   └── global.css       # Global CSS styles
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Application entry point
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Features

### Authentication
- User registration with validation
- User login with JWT token
- Protected routes
- Automatic token refresh
- Logout functionality

### Dashboard
- Task statistics (Total, TODO, In Progress, Done)
- Progress visualization
- Recent tasks overview
- Quick navigation

### Task Management
- Create new tasks
- Edit existing tasks
- Delete tasks with confirmation
- Filter by status, assignee, due date
- "My Tasks" filter
- Task assignment to team members
- Due date management

### User Profile
- Update profile information
- Avatar management
- View account details

## API Integration

The frontend communicates with the backend through the API service layer (`src/services/api.js`).

### Authentication Flow

1. User logs in/registers
2. JWT token received from backend
3. Token stored in localStorage
4. Token automatically included in subsequent requests
5. On page reload, token validated with backend

### API Service Structure

```javascript
// Auth services
authService.register(userData)
authService.login(credentials)
authService.getProfile()
authService.updateProfile(userData)

// Task services
taskService.getAll(params)
taskService.getById(id)
taskService.create(taskData)
taskService.update(id, taskData)
taskService.delete(id)
taskService.getStats()

// Comment services
commentService.getByTaskId(taskId)
commentService.create(taskId, content)
commentService.delete(id)

// User services
userService.getAll()
userService.getById(id)

// Activity services
activityService.getByTaskId(taskId)
activityService.getRecent(limit)
```

## Styling

The application uses custom CSS with a modern, clean design:

- **Color Scheme:**
  - Primary: #0d6efd (Blue)
  - Success: #198754 (Green)
  - Danger: #dc3545 (Red)
  - Secondary: #6c757d (Gray)

- **Design Principles:**
  - Mobile-first responsive design
  - Consistent spacing and typography
  - Smooth transitions and animations
  - Accessible color contrasts
  - Card-based layouts

## Routing

The application uses React Router v6 for navigation:

- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/` - Dashboard (protected)
- `/tasks` - Task list (protected)
- `/profile` - User profile (protected)

Protected routes redirect to login if user is not authenticated.

## State Management

Currently using React's built-in state management:
- Component state with `useState`
- Side effects with `useEffect`
- Props for data passing
- Context-free architecture (simple app)

For future scaling, consider:
- Redux or Zustand for global state
- React Query for server state
- Context API for shared state

## Development Tips

### Hot Module Replacement (HMR)

Vite provides fast HMR. Changes to components are reflected instantly without full page reload.

### Component Development

Create new components in `src/components/`:

```javascript
import React from 'react';
import './MyComponent.css';

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div className="my-component">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`

### API Integration

To add new API endpoints:

1. Add service function in `src/services/api.js`
2. Import and use in component
3. Handle loading, error, and success states

Example:
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const loadData = async () => {
    try {
      const response = await myService.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
```

## Troubleshooting

### API Connection Issues

**Problem:** Cannot connect to backend

**Solutions:**
1. Ensure backend is running on port 5000
2. Check proxy configuration in `vite.config.js`
3. Clear browser cache and localStorage
4. Check browser console for errors

### Authentication Issues

**Problem:** Token expired or invalid

**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Check token expiration settings in backend

### Build Issues

**Problem:** Build fails

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## Performance Optimization

### Production Build

The production build is optimized automatically:
- Code splitting
- Minification
- Tree shaking
- Asset optimization

### Best Practices

1. **Lazy Loading:**
   ```javascript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Memoization:**
   ```javascript
   const MemoizedComponent = React.memo(Component);
   ```

3. **useCallback for event handlers:**
   ```javascript
   const handleClick = useCallback(() => {
     // handler logic
   }, [dependencies]);
   ```

4. **useMemo for expensive calculations:**
   ```javascript
   const sortedData = useMemo(() => {
     return data.sort(compareFn);
   }, [data]);
   ```

## Testing

Currently, the project doesn't include tests. To add testing:

1. Install testing libraries:
   ```bash
   npm install -D @testing-library/react @testing-library/jest-dom vitest
   ```

2. Add test script in `package.json`:
   ```json
   "scripts": {
     "test": "vitest"
   }
   ```

3. Create test files: `ComponentName.test.jsx`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop `dist/` folder to Netlify
3. Or use Netlify CLI

### Environment Variables

For production, set environment variables:
- `VITE_API_URL` - Backend API URL

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The application follows basic accessibility guidelines:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Form validation feedback

## Future Enhancements

- Add unit and integration tests
- Implement state management (Redux/Zustand)
- Add dark mode
- Improve mobile responsiveness
- Add PWA capabilities
- Implement real-time updates with WebSockets
- Add internationalization (i18n)
