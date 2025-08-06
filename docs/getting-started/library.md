# Libraries

## Overview

Libraries in ALOMA are reusable JavaScript code modules that can be shared across multiple steps within a workspace. They provide a way to organize common functionality, reduce code duplication, and create maintainable automation workflows.

Libraries consist of:
- **Display Name** - Human-readable name for the library
- **Namespace** - Internal identifier used to access the library in steps
- **Documentation** - JSDoc comments describing the library's purpose and functions
- **Function Declarations** - TypeScript-style declarations of public functions
- **Implementation Code** - The actual JavaScript code that implements the functions

## Creating a Library

### Using the Web UI

1. Navigate to the **Library** section in your workspace
2. Click the **Create** button (green wrench icon)
3. Enter a display name for your library (e.g., "EncodeBase64")
4. Click **Create** to open the library editor

### Library Structure

A library has several key components:

#### Display Name
The human-readable name that appears in the library list (e.g., "EncodeBase64")

#### Namespace
The internal identifier used to access the library in steps (e.g., "base64")

#### Documentation
JSDoc comments that describe the library's purpose and usage:

```javascript
/**
 * Encode an object into a base64 string
 **/
```

#### Function Declarations
TypeScript-style declarations that define the public interface:

```typescript
declare function encode(obj: any): string;
declare function decode(base64String: string): string;
```

#### Implementation Code
The actual JavaScript code that implements the functionality:

```javascript
const encode = (obj) => {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const byteArray = new Uint8Array(Object.values(obj));
  let binaryString = "";

  // Convert each byte to a binary string
  for (let i = 0; i < byteArray.length; i++) {
    binaryString += byteArray[i].toString(2).padStart(8, '0');
  }
  
  // Convert binary to base64
  let base64 = "";
  for (let i = 0; i < binaryString.length; i += 6) {
    const chunk = binaryString.slice(i, i + 6);
    const decimal = parseInt(chunk, 2);
    base64 += base64Chars[decimal];
  }
  
  return base64;
};

function decode(base64String) {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let binaryString = "";
  
  // Convert base64 to binary
  for (let i = 0; i < base64String.length; i++) {
    const char = base64String[i];
    const index = base64Chars.indexOf(char);
    if (index !== -1) {
      binaryString += index.toString(2).padStart(6, '0');
    }
  }
  
  // Convert binary to string
  let decodedString = "";
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = binaryString.slice(i, i + 8);
    if (byte.length === 8) {
      const charCode = parseInt(byte, 2);
      decodedString += String.fromCharCode(charCode);
    }
  }
  
  return decodedString;
}

module.exports = { encode, decode };
```

## Using Libraries in Steps

Once a library is created, you can access its functions in any step using the `lib` object:

```javascript
// Access library functions using the namespace
const pdfBase64 = lib.base64.encode(pdf);
const decodedData = lib.base64.decode(encodedString);

// Use the encoded data in your step
data.encodedPdf = pdfBase64;
data.decodedContent = decodedData;
```

### Library Access Pattern

```javascript
lib.{namespace}.{functionName}(parameters)
```

Where:
- `{namespace}` is the library's namespace (e.g., "base64")
- `{functionName}` is the function name declared in the library (e.g., "encode", "decode")

## Best Practices

### Library Design

1. **Clear Purpose** - Each library should have a single, well-defined purpose
2. **Descriptive Names** - Use clear, descriptive names for both display name and namespace
3. **Comprehensive Documentation** - Include JSDoc comments explaining the library's purpose and usage
4. **Type Declarations** - Use TypeScript-style declarations to clearly define the public interface

### Code Organization

1. **Modular Functions** - Break complex functionality into smaller, focused functions
2. **Error Handling** - Include appropriate error handling in your library functions
3. **Performance** - Consider performance implications, especially for frequently used libraries
4. **Testing** - Test your library functions thoroughly before using them in production

### Naming Conventions

- **Display Name**: Use PascalCase with descriptive names (e.g., "EncodeBase64", "DataValidator")
- **Namespace**: Use camelCase with short, memorable names (e.g., "base64", "validator")
- **Functions**: Use camelCase with descriptive names (e.g., "encode", "validateEmail")

## Example Libraries

### Data Validation Library

```javascript
/**
 * Common data validation functions
 **/
declare function validateEmail(email: string): boolean;
declare function validatePhone(phone: string): boolean;
declare function validateUrl(url: string): boolean;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = { validateEmail, validatePhone, validateUrl };
```

### String Utilities Library

```javascript
/**
 * Common string manipulation utilities
 **/
declare function capitalize(str: string): string;
declare function slugify(str: string): string;
declare function truncate(str: string, length: number): string;

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const slugify = (str) => {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const truncate = (str, length) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

module.exports = { capitalize, slugify, truncate };
```

## Managing Libraries

### Enabling/Disabling
Libraries can be enabled or disabled using the checkbox in the library editor. Disabled libraries are not available in steps.

### Editing
Click the pencil icon in the library list to edit an existing library.

### Deleting
Use the delete button in the library editor to remove a library. This action cannot be undone.

### Tags
Add tags to organize and categorize your libraries for easier management.

## Integration with Steps

Libraries seamlessly integrate with steps, providing reusable functionality across your automation workflows. They help maintain clean, organized code and reduce duplication while enabling complex automation scenarios. 