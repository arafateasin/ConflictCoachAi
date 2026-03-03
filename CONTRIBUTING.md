# Contributing to ConflictCoach AI 🤝

First off, thank you for considering contributing to ConflictCoach AI! It's people like you that make ConflictCoach AI such a great tool for learning conflict resolution skills.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or bun package manager
- Git
- API keys for ElevenLabs and Google Gemini (for testing voice features)

### Quick Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ConflictCoachAI.git
cd ConflictCoachAI

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

## 🎯 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]
```

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** - how should it work?
- **Alternatives considered**
- **Mockups or examples** if applicable

### Adding New Features 🎨

We welcome new features! Here are some areas where contributions are especially appreciated:

1. **New Scenarios** - Add more conflict resolution scenarios
2. **UI/UX Improvements** - Enhance the user interface
3. **Analytics** - Add more performance metrics
4. **Accessibility** - Improve accessibility features
5. **Documentation** - Improve guides and tutorials
6. **Testing** - Add test coverage
7. **Localization** - Add support for more languages

### Your First Code Contribution

Unsure where to start? Look for issues labeled:

- `good first issue` - Simple issues perfect for beginners
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ConflictCoachAI.git
cd ConflictCoachAI
```

### 2. Create a Branch

```bash
# Create a new branch for your feature
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Make Changes

- Write clean, readable code
- Follow our coding standards (below)
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Type check
npm run type-check
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "✨ Add amazing feature"
```

## 📤 Pull Request Process

1. **Update Documentation** - Ensure README and other docs reflect your changes
2. **Add Tests** - All new features should have tests
3. **Run Tests** - Ensure all tests pass locally
4. **Update CHANGELOG** - Add your changes to the unreleased section
5. **Create PR** - Use the PR template and fill it out completely
6. **Link Issues** - Reference related issues (e.g., "Fixes #123")
7. **Be Responsive** - Respond to code review feedback promptly

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

Describe how you tested your changes

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define types/interfaces for props and data structures
- Avoid `any` - use proper types
- Use meaningful variable and function names

### React Components

```typescript
// Good ✅
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
}

export function Button({
  label,
  onClick,
  variant = "primary",
  isDisabled = false,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
}

// Bad ❌
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### File Organization

```
components/
├── ComponentName.tsx          # Component implementation
├── ComponentName.test.tsx     # Component tests
└── index.ts                   # Export (if needed)
```

### Naming Conventions

- **Components**: PascalCase (`VoiceOrb.tsx`, `ScoreCard.tsx`)
- **Utilities**: camelCase (`conversationUtils.ts`, `formatScore.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SCORE`, `DEFAULT_TIMEOUT`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `AnalysisResult`)

### CSS/Styling

- Use Tailwind CSS utility classes
- Keep custom CSS minimal
- Use shadcn/ui components when possible
- Follow mobile-first responsive design

## 🧪 Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for >80% code coverage
- Use descriptive test names

```typescript
describe("ScoreCard", () => {
  it("should display excellent rating for scores above 90", () => {
    const { getByText } = render(<ScoreCard score={95} />);
    expect(getByText("Excellent")).toBeInTheDocument();
  });

  it("should apply correct color class for high scores", () => {
    const { container } = render(<ScoreCard score={85} />);
    expect(container.firstChild).toHaveClass("text-green-600");
  });
});
```

### Integration Tests

- Test component interactions
- Test user workflows
- Mock API calls appropriately

### E2E Tests (Future)

- Test critical user journeys
- Run before major releases

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
feat(scenarios): add workplace conflict scenario

Add new "Team Dispute" scenario for practicing workplace conflict resolution.
Includes dynamic difficulty adjustment based on user performance.

Closes #45

---

fix(voice): resolve audio dropout during long sessions

Fixed WebSocket reconnection logic to prevent audio interruptions
during extended training sessions.

Fixes #78
```

### Emojis (Optional but Encouraged)

- ✨ `:sparkles:` - New feature
- 🐛 `:bug:` - Bug fix
- 📚 `:books:` - Documentation
- 💄 `:lipstick:` - UI/style update
- ♻️ `:recycle:` - Refactoring
- ✅ `:white_check_mark:` - Tests
- 🚀 `:rocket:` - Performance

## 🏗️ Architecture Guidelines

### Component Structure

- **Presentational Components**: Focus on UI, receive data via props
- **Container Components**: Handle logic, state management, and data fetching
- **Hooks**: Extract reusable logic into custom hooks
- **Utils**: Pure functions for data transformation

### State Management

- Use React Context for global state
- Use local state for component-specific data
- Consider state management libraries for complex apps

### API Integration

- Centralize API calls in service files
- Handle errors gracefully
- Provide loading states
- Cache responses when appropriate

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calculates the overall performance score based on multiple metrics.
 *
 * @param empathy - Empathy score (0-100)
 * @param problemSolving - Problem-solving score (0-100)
 * @param professionalism - Professionalism score (0-100)
 * @returns Overall score weighted by importance (0-100)
 *
 * @example
 * calculateScore(85, 90, 95) // Returns 90
 */
function calculateScore(
  empathy: number,
  problemSolving: number,
  professionalism: number,
): number {
  // Implementation
}
```

### README Updates

- Update README for new features
- Add usage examples
- Update setup instructions if needed
- Keep screenshots current

## 🌍 Community

### Getting Help

- **Discord**: [Join our community](https://discord.gg/conflictcoach)
- **GitHub Discussions**: For questions and ideas
- **Stack Overflow**: Tag questions with `conflictcoach-ai`

### Staying Updated

- Watch the repository for updates
- Follow [@ConflictCoachAI](https://twitter.com/conflictcoach) on Twitter
- Subscribe to our newsletter

## 🎉 Recognition

Contributors are recognized in:

- **Contributors section** in README
- **Release notes** for significant contributions
- **Hall of Fame** on our website

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Your contributions make ConflictCoach AI better for everyone. We appreciate your time and effort!

**Happy Coding! 🚀**

_Have questions? Open an issue or reach out to the maintainers._
