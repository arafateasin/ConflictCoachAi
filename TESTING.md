# 🧪 Testing Documentation

## Overview

ConflictCoach AI uses a comprehensive testing strategy following software engineering best practices to ensure code quality, reliability, and maintainability.

## Testing Stack

- **Vitest** - Unit and integration testing framework
- **Testing Library** - React component testing utilities
- **Playwright** - End-to-end browser testing
- **MSW** - API mocking for tests
- **V8** - Code coverage reporting

## Test Types

### 1. Unit Tests 🔬

Test individual components and functions in isolation.

**Location:** `tests/components/`, `tests/lib/`, `tests/config/`

**Run:**

```bash
npm run test
```

**Examples:**

- Component rendering tests
- Utility function tests
- Configuration validation tests

### 2. Integration Tests 🔗

Test interactions between multiple components and systems.

**Location:** `tests/integration/`

**Features tested:**

- Component communication
- State management across components
- Data flow through the application
- Error recovery mechanisms

### 3. End-to-End Tests 🌐

Test complete user workflows in a real browser environment.

**Location:** `tests/e2e/`

**Run:**

```bash
npm run test:e2e
```

**Features tested:**

- Full conversation flows
- User navigation
- Responsive design
- Accessibility compliance
- Cross-browser compatibility

### 4. API Tests 📡

Test API endpoints and server-side logic.

**Location:** `tests/api/`

**Features tested:**

- Request validation
- Response formatting
- Error handling
- Fallback mechanisms

## Test Commands

```bash
# Run all unit/integration tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## Writing Tests

### Component Test Template

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { YourComponent } from "@/components/YourComponent";

describe("YourComponent", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<YourComponent />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Behavior", () => {
    it("handles user interaction", async () => {
      const user = userEvent.setup();
      render(<YourComponent />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(screen.getByText("Clicked")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty props", () => {
      render(<YourComponent data={[]} />);
      expect(screen.getByText("No data")).toBeInTheDocument();
    });
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should complete user workflow", async ({ page }) => {
    // Navigate
    await page.click('[data-testid="start-button"]');

    // Interact
    await page.fill('input[name="message"]', "Hello");
    await page.click('button[type="submit"]');

    // Assert
    await expect(page.locator(".response")).toBeVisible();
  });
});
```

## Best Practices

### ✅ DO

1. **Write descriptive test names**

   ```typescript
   it("should display error message when API fails");
   ```

2. **Follow AAA pattern** (Arrange, Act, Assert)

   ```typescript
   // Arrange
   const user = userEvent.setup();
   render(<Component />);

   // Act
   await user.click(screen.getByRole("button"));

   // Assert
   expect(screen.getByText("Success")).toBeInTheDocument();
   ```

3. **Test user behavior, not implementation**

   ```typescript
   // Good
   await user.click(screen.getByRole("button", { name: "Submit" }));

   // Avoid
   await user.click(screen.getByTestId("submit-button-internal-id-123"));
   ```

4. **Use data-testid for complex selectors**

   ```typescript
   <div data-testid="conversation-panel">...</div>
   ```

5. **Mock external dependencies**
   ```typescript
   vi.mock("@/lib/api", () => ({
     fetchData: vi.fn(() => Promise.resolve(mockData)),
   }));
   ```

### ❌ DON'T

1. **Test implementation details**
2. **Write brittle selectors**
3. **Skip edge cases**
4. **Ignore accessibility**
5. **Create dependent tests**

## Coverage Goals

We aim for the following coverage targets:

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

**View coverage report:**

```bash
npm run test:coverage
open coverage/index.html
```

## CI/CD Integration

Tests run automatically on:

- Every pull request
- Merges to main branch
- Pre-deployment checks

**GitHub Actions workflow:**

```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:run
    npm run test:e2e
```

## Testing Checklist

Before submitting a PR, ensure:

- [ ] All existing tests pass
- [ ] New features have unit tests
- [ ] New features have integration tests
- [ ] Complex workflows have E2E tests
- [ ] Coverage hasn't decreased
- [ ] No console errors/warnings
- [ ] Accessibility tests pass
- [ ] Tests run in CI/CD pipeline

## Debugging Tests

### Vitest

```bash
# Run specific test file
npm run test -- VoiceOrb.test.tsx

# Run tests matching pattern
npm run test -- --grep "renders correctly"

# Debug in UI mode
npm run test:ui
```

### Playwright

```bash
# Debug mode (opens browser)
npx playwright test --debug

# Run specific test
npx playwright test homepage.spec.ts

# Generate test code
npx playwright codegen http://localhost:3000
```

## Common Issues & Solutions

### Issue: Tests timeout

**Solution:** Increase timeout or use `waitFor`

```typescript
await waitFor(
  () => {
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  },
  { timeout: 5000 },
);
```

### Issue: Component not found

**Solution:** Ensure proper cleanup and wait for renders

```typescript
afterEach(() => {
  cleanup();
});
```

### Issue: Mock not working

**Solution:** Clear mocks between tests

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Guide](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Kent C. Dodds Testing Blog](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing to Tests

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure tests are comprehensive
3. Update this documentation if needed
4. Add examples for complex test scenarios

---

**Questions?** Open an issue or reach out to the team!

**Remember:** Good tests are an investment in code quality and team productivity. 🚀
