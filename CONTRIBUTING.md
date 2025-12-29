# Panduan Kontribusi

Terima kasih atas ketertarikan Anda untuk berkontribusi pada Pakasir SDK! Kami sangat menghargai kontribusi dari komunitas dalam bentuk apapun, baik itu melalui pelaporan bug, saran fitur, perbaikan dokumentasi, atau kontribusi kode.

## 📋 Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Cara Berkontribusi](#cara-berkontribusi)
- [Development Setup](#development-setup)
- [Struktur Project](#struktur-project)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Pelaporan Bug](#pelaporan-bug)
- [Saran Fitur](#saran-fitur)

## Code of Conduct

Dengan berpartisipasi dalam project ini, Anda diharapkan untuk menjaga lingkungan yang ramah dan inklusif. Harap hormati semua kontributor dan pengguna.

## Cara Berkontribusi

Ada beberapa cara untuk berkontribusi:

### 1. 🐛 Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue dengan informasi berikut:

- Deskripsi singkat tentang bug
- Langkah-langkah untuk mereproduksi
- Perilaku yang diharapkan vs perilaku aktual
- Environment (Node.js version, OS, dll)
- Code snippet jika memungkinkan

### 2. 💡 Mengusulkan Fitur Baru

Kami terbuka terhadap ide-ide baru! Untuk mengusulkan fitur:

- Buat issue dengan label "feature request"
- Jelaskan use case dan manfaat fitur tersebut
- Berikan contoh implementasi jika memungkinkan

### 3. 📝 Perbaikan Dokumentasi

Dokumentasi yang baik sangat penting. Anda dapat membantu dengan:

- Memperbaiki typo atau kesalahan
- Menambahkan contoh yang lebih jelas
- Menerjemahkan dokumentasi
- Meningkatkan JSDoc comments

### 4. 💻 Kontribusi Kode

Untuk kontribusi kode, silakan ikuti proses berikut.

## Development Setup

### Prerequisites

Pastikan Anda telah menginstall:

- Node.js (v16 atau lebih tinggi)
- npm, yarn, atau pnpm
- Git

### Setup Local Environment

1. **Fork repository**

   Fork repository ini ke akun GitHub Anda.

2. **Clone repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/pakasir.git
   cd pakasir
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create .env file untuk testing**

   ```bash
   # Copy file .env.example jika ada, atau buat baru
   cp .env.example .env
   ```

   Edit file `.env`:

   ```env
   PAKASIR_PROJECT_SLUG=your-test-project-slug
   PAKASIR_API_KEY=your-test-api-key
   ```

5. **Build project**

   ```bash
   npm run build
   ```

6. **Run tests**

   ```bash
   npm test
   ```

### Branch Strategy

- `main` - Branch stabil untuk production
- `dev` - Branch development untuk integrasi fitur
- `feature/*` - Branch untuk fitur baru
- `bugfix/*` - Branch untuk perbaikan bug
- `docs/*` - Branch untuk perubahan dokumentasi

## Struktur Project

```
pakasir/
├── src/                    # Source code
│   ├── core/              # Core functionality
│   │   └── client.ts      # Main client class
│   ├── types/             # TypeScript type definitions
│   │   ├── api.d.ts       # API response types
│   │   ├── client.d.ts    # Client config types
│   │   ├── sdk.d.ts       # SDK response types
│   │   └── transaction.d.ts # Transaction types
│   ├── utils/             # Utility functions
│   │   ├── request.ts     # HTTP request handler
│   │   └── utils.ts       # Helper functions
│   ├── consts.ts          # Constants
│   └── index.ts           # Main entry point
├── tests/                 # Test files
│   ├── main.test.ts       # Main functionality tests
│   └── transaction.test.ts # Transaction tests
├── examples/              # Usage examples
│   ├── esm/              # ES Modules examples
│   └── commonjs/         # CommonJS examples
├── dist/                  # Built files (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
└── eslint.config.js
```

## Coding Guidelines

### TypeScript

- Gunakan TypeScript untuk semua kode baru
- Hindari penggunaan `any` type
- Tambahkan type annotations yang jelas
- Export types yang mungkin berguna untuk users

### JSDoc Comments

Semua public methods dan types harus memiliki JSDoc comments yang lengkap:

```typescript
/**
 * Deskripsi singkat tentang function.
 *
 * @remarks
 * Penjelasan lebih detail jika diperlukan.
 *
 * @param paramName - Deskripsi parameter
 * @param optionalParam - Deskripsi parameter opsional
 *
 * @returns Deskripsi return value
 *
 * @throws {Error} Kondisi yang menyebabkan error
 *
 * @example
 * ```ts
 * // Contoh penggunaan
 * const result = functionName('value');
 * ```
 *
 * @see {@link RelatedType} untuk informasi terkait
 */
```

### Code Style

Project ini menggunakan ESLint untuk menjaga konsistensi kode:

```bash
# Check linting
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

**Pedoman umum:**

- Gunakan 2 spaces untuk indentation
- Gunakan semicolons
- Gunakan single quotes untuk strings
- Maksimal line length: 100 karakter
- Gunakan camelCase untuk variables dan functions
- Gunakan PascalCase untuk classes dan types
- Gunakan UPPERCASE untuk constants

### Error Handling

- Selalu throw Error objects dengan pesan yang jelas
- Prefix error messages dengan context (e.g., "Failed to create transaction: ...")
- Validate input sebelum making API calls
- Handle semua edge cases

```typescript
// ✅ Good
if (!orderId) {
  throw new Error("Transaction ID must be provided.");
}

// ❌ Bad
if (!orderId) {
  throw "No order ID";
}
```

### Naming Conventions

- **Private properties/methods:** Prefix dengan underscore (`_baseUrl`)
- **Constants:** UPPERCASE dengan underscore (`DEFAULT_BASE_URL`)
- **Types/Interfaces:** PascalCase (`ClientConfig`, `PaymentMethod`)
- **Functions/Methods:** camelCase (`createTransaction`, `validateInputs`)
- **Files:** kebab-case (`client.ts`, `transaction.d.ts`)

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Setiap fitur baru harus disertai dengan tests:

```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });

  it('should throw error for invalid input', () => {
    expect(() => {
      functionToTest(null);
    }).toThrow('Expected error message');
  });
});
```

**Best practices:**

- Test happy path dan edge cases
- Test error scenarios
- Gunakan descriptive test names
- Keep tests isolated dan independent
- Mock external dependencies (API calls)

### Test Coverage

Usahakan untuk menjaga test coverage minimal:

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Pull Request Process

### Sebelum Submit PR

1. **Update dari main branch**

   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Pastikan semua tests passing**

   ```bash
   npm test
   ```

3. **Check linting**

   ```bash
   npm run lint:fix
   ```

4. **Build project**

   ```bash
   npm run build
   ```

5. **Update documentation** jika diperlukan

### Membuat Pull Request

1. **Push branch ke fork Anda**

   ```bash
   git push origin your-feature-branch
   ```

2. **Buat PR di GitHub** dengan informasi:

   - **Title:** Deskripsi singkat dan jelas
     - Format: `[type] Brief description`
     - Type: feat, fix, docs, refactor, test, chore
     - Contoh: `[feat] Add support for new payment method`

   - **Description:** Jelaskan perubahan Anda
     - Apa yang berubah?
     - Kenapa perubahan ini diperlukan?
     - Bagaimana cara testing?
     - Link ke issue terkait (jika ada)

   - **Checklist:**
     ```markdown
     - [ ] Tests passing
     - [ ] Linting passing
     - [ ] Documentation updated
     - [ ] Changelog updated (jika applicable)
     ```

3. **Review process**

   - Maintainer akan review PR Anda
   - Mungkin ada request untuk perubahan
   - Discussion dan feedback adalah bagian normal dari proses
   - Jangan ragu untuk bertanya jika ada yang tidak jelas

### PR Guidelines

- **Keep PRs focused:** Satu PR untuk satu fitur atau fix
- **Small PRs:** Lebih mudah untuk review dan merge
- **Clear commits:** Gunakan descriptive commit messages
- **Update PR:** Jika ada review comments, push changes ke branch yang sama
- **Be patient:** Review membutuhkan waktu, terutama untuk perubahan besar

### Commit Message Format

Gunakan conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Perubahan dokumentasi
- `style`: Formatting, missing semicolons, dll
- `refactor`: Refactoring code
- `test`: Menambah atau memperbaiki tests
- `chore`: Maintenance tasks

**Contoh:**

```bash
feat(client): add support for PayPal payment method

- Add PayPal to PaymentMethod type
- Update validation for minimum amount
- Add example in documentation

Closes #123
```

## Pelaporan Bug

Gunakan [GitHub Issues](https://github.com/gtpshax/pakasir/issues) untuk melaporkan bug.

### Template Bug Report

```markdown
**Deskripsi Bug**
Deskripsi singkat dan jelas tentang bug.

**Langkah Reproduksi**
1. Buat client dengan '...'
2. Panggil method '...'
3. Lihat error

**Expected Behavior**
Deskripsi tentang apa yang seharusnya terjadi.

**Actual Behavior**
Deskripsi tentang apa yang benar-benar terjadi.

**Screenshots/Logs**
Jika applicable, tambahkan screenshots atau error logs.

**Environment**
- Node.js version: [e.g., v18.0.0]
- pakasir version: [e.g., 1.0.0]
- OS: [e.g., Windows 10, macOS 13, Ubuntu 22.04]

**Additional Context**
Informasi tambahan tentang masalah.
```

## Saran Fitur

Gunakan [GitHub Issues](https://github.com/gtpshax/pakasir/issues) dengan label "feature request".

### Template Feature Request

```markdown
**Deskripsi Fitur**
Deskripsi jelas tentang fitur yang diinginkan.

**Use Case**
Jelaskan use case atau problem yang diselesaikan oleh fitur ini.

**Proposed Solution**
Deskripsi tentang bagaimana fitur ini bisa diimplementasikan.

**Alternatives**
Alternatif solusi yang sudah Anda pertimbangkan.

**Additional Context**
Screenshots, mockups, atau informasi tambahan.
```

## Questions?

Jika Anda memiliki pertanyaan tentang kontribusi:

- 💬 Buka [Discussion](https://github.com/gtpshax/pakasir/discussions)
- 📧 Contact maintainer melalui GitHub

## License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah [MIT License](LICENSE) yang sama dengan project ini.

---

Terima kasih telah berkontribusi pada Pakasir SDK! 🎉
