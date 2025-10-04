# Contributing to Task Manager

First off, thank you for considering contributing to Task Manager! It's people like you that make Task Manager such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/React styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install dependencies**
   ```bash
   npm run install-all
   ```

5. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb taskmanager
   
   # Initialize tables
   cd backend
   npm run init-db
   cd ..
   ```

6. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

7. **Make your changes**

8. **Test your changes**
   ```bash
   # Start backend
   cd backend
   npm run dev
   
   # In another terminal, start frontend
   cd frontend
   npm run dev
   ```

9. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

10. **Push to your fork**
    ```bash
    git push origin feature/your-feature-name
    ```

11. **Create a Pull Request**

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

* Use 2 spaces for indentation
* Use camelCase for variable and function names
* Use PascalCase for component names
* Use meaningful variable names
* Add comments for complex logic
* Keep functions small and focused

### React Styleguide

* One component per file
* Use functional components with hooks
* Use PropTypes or TypeScript for type checking
* Keep components focused and reusable
* Use meaningful prop names
* Extract complex logic into custom hooks

### CSS Styleguide

* Use meaningful class names
* Follow BEM naming convention when applicable
* Keep selectors specific but not overly complex
* Group related properties together
* Use CSS variables for repeated values

## Project Structure

```
task-manager/
├── backend/              # Backend API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Server entry point
│   └── package.json
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── styles/       # CSS files
│   │   ├── utils/        # Helper functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
└── README.md
```

## Testing Guidelines

### Backend Tests

* Test all API endpoints
* Test error handling
* Test authentication and authorization
* Mock database calls when appropriate

### Frontend Tests

* Test component rendering
* Test user interactions
* Test API integration
* Test routing

## Documentation

* Update README.md if you change functionality
* Add JSDoc comments for functions
* Update API documentation for new endpoints
* Add inline comments for complex logic

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
