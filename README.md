# Pattern Ghoul Checker 🎃

A powerful pattern checker for React projects that validates translation usage with `react-i18next`.

## Features

- ✅ Checks all `useTranslation` hook usage
- ✅ Validates that all translations have `defaultValue`
- ✅ Ensures default values are in Arabic
- ✅ Beautiful CLI output with colors and progress bars
- ✅ Shows line numbers and specific issues
- ✅ Returns exit code 1 if issues found (perfect for CI/CD)

## Installation

```bash
npm install --save-dev pattern-ghoul-checker
```

Or globally:

```bash
npm install -g pattern-ghoul-checker
```

## Usage

### CLI

Run in your project root:

```bash
npx pattern-ghoul-checker
```

Or specify a path:

```bash
npx pattern-ghoul-checker ./src
```

### Programmatic Usage

```typescript
import { TranslationChecker, Reporter } from 'pattern-ghoul-checker';

const checker = new TranslationChecker();
const result = await checker.checkProject('./src');
Reporter.printResults(result);
```

## Example Output

```
🔍 Checking translations in project...

═══════════════════════════════════════════════════════
           🎃 PATTERN GHOUL CHECKER REPORT            
═══════════════════════════════════════════════════════

📊 SUMMARY:
   Files Checked: 5
   Files with Issues: 2
   Total Translations: 10
   ✓ Passed: 7
   ✗ Failed: 3

   Success Rate: ████████████████████████████░░░░░░░░░░░░ 70.0%

❌ ISSUES FOUND:

src/components/BreadCrumb.tsx
   ✗ Line 45:12
     Key: add_new_employee
     Issue: Missing defaultValue for translation

═══════════════════════════════════════════════════════
```

## CI/CD Integration

Add to your `package.json`:

```json
{
  "scripts": {
    "check:translations": "pattern-ghoul-checker"
  }
}
```

## License

MIT
