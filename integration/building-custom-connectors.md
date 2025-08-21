# Building Custom Connectors

## Building Custom Connectors

**Custom connectors in ALOMA enable you to integrate with any service, API, or system that doesn't have an existing cloud connector. Built using the ALOMA Integration SDK, custom connectors run on your infrastructure while providing the same seamless integration experience as cloud connectors.**

Unlike cloud connectors that ALOMA hosts and maintains, custom connectors give you complete control over authentication, data processing, and deployment while still benefiting from ALOMA's unified connector interface and robust error handling.

### Understanding Custom Connectors

Custom connectors are Node.js applications built with the ALOMA Integration SDK that run on your infrastructure and communicate with ALOMA workspaces through secure registration keys. They can handle any integration scenario from simple API wrappers to complex data processing pipelines.

#### Connector Types

**On-Premise Connectors** - Run on your servers or cloud infrastructure **Local Development Connectors** - Run locally for development and testing **Private Cloud Connectors** - Deploy to your private cloud environment **Hybrid Connectors** - Combine on-premise processing with cloud services

#### Key Benefits

**Complete Control** - Full ownership of data processing and security **Custom Logic** - Implement any business logic or data transformation **Private APIs** - Connect to internal systems and private APIs **Compliance** - Meet specific security and regulatory requirements **Performance** - Optimize for your specific use cases and infrastructure

### Development Prerequisites

Before building custom connectors, ensure you have:

```bash
# Required tools
node --version  # Node.js 16+ required
npm --version   # npm 8+ required
yarn --version  # yarn 1.22+ recommended

# ALOMA CLI for management
npm install -g @aloma.io/aloma

# Verify ALOMA authentication
aloma auth
```

### Creating Your First Custom Connector

The registration process provides you with a unique connector ID that links your custom connector to ALOMA workspaces.

#### Step 1: Initialize Connector Project

Create a new connector project using the ALOMA Integration SDK:

```bash
# Create connector with your registered ID
npx @aloma.io/integration-sdk@latest create my-custom-connector --connector-id 1234

# Navigate to project directory
cd my-custom-connector

# Install dependencies
yarn install

# If yarn  fail try
yarn install --ignore-engines
```

This generates a complete connector project with TypeScript configuration, development tools, and example code.

#### Step 2: Basic Connector Structure

Understand the generated project structure:

```
my-custom-connector/
├── src/
│   ├── index.mts           # Main entry point with Builder and runtime
│   └── controller/
│       └── index.mts       # Controller class extending AbstractController
├── package.json             # Project configuration with integration-sdk dependency
├── tsconfig.json           # TypeScript configuration
├── Containerfile            # Docker container configuration
├── entrypoint.sh           # Container entrypoint script
├── .gitignore              # Git ignore patterns
└── yarn.lock               # Yarn dependency lock file
```

The generated structure uses the modern `@aloma.io/integration-sdk` v3 with:
- **ESM modules** (`.mts` files) for modern Node.js compatibility
- **Builder pattern** for runtime construction
- **Controller-based architecture** extending `AbstractController`
- **Built-in TypeScript compilation** and development tools

#### Step 4: Implement Connector Logic

Edit `src/controller/index.mts` to implement your integration methods:

```typescript
import { AbstractController } from '@aloma.io/integration-sdk';

export default class Controller extends AbstractController {
  
  /**
   * Example: Create a new user
   */
  async createUser(args: { email: string; firstName: string; lastName: string; role?: string }) {
    try {
      // Your API integration logic here
      const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getConfig('API_KEY')}`
        },
        body: JSON.stringify({
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
          role: args.role || 'user'
        })
      });

      if (!response.ok) {
        throw new Error(`User creation failed: ${response.statusText}`);
      }

      const userData = await response.json();
      
      return {
        id: userData.id,
        email: userData.email,
        created: userData.created_at,
        status: 'active'
      };
    } catch (error) {
      this.log.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Example: Get user by ID
   */
  async getUser(args: { userId: string }) {
    try {
      const response = await fetch(`https://api.example.com/users/${args.userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getConfig('API_KEY')}`
        }
      });

      if (response.status === 404) {
        throw new Error(`User not found: ${args.userId}`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      this.log.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Example: Update user
   */
  async updateUser(args: { userId: string; firstName?: string; lastName?: string; role?: string; status?: string }) {
    try {
      const updateData: any = {};
      if (args.firstName) updateData.first_name = args.firstName;
      if (args.lastName) updateData.last_name = args.lastName;
      if (args.role) updateData.role = args.role;
      if (args.status) updateData.status = args.status;

      const response = await fetch(`https://api.example.com/users/${args.userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.getConfig('API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`User update failed: ${response.statusText}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      this.log.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Example: List users with filters
   */
  async listUsers(args: { role?: string; status?: string; limit?: number; offset?: number } = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (args.role) queryParams.append('role', args.role);
      if (args.status) queryParams.append('status', args.status);
      if (args.limit) queryParams.append('limit', args.limit.toString());
      if (args.offset) queryParams.append('offset', args.offset.toString());

      const url = `https://api.example.com/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getConfig('API_KEY')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list users: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.log.error('Error listing users:', error);
      throw error;
    }
  }

  /**
   * Example: Simple hello method
   */
  async hello(args: any) {
    return { hi: 'world' };
  }
}
```

**Key differences from the old SDK version:**
- **Controller-based**: Extend `AbstractController` instead of `AlomaConnector`
- **Method-based**: Define methods directly on the controller class
- **No decorators**: Methods are automatically exposed as connector actions
- **Simplified structure**: No need for separate authentication handling
- **Modern fetch API**: Use native fetch instead of custom request methods
- **Configuration access**: Use `this.getConfig('KEY')` to access environment variables

#### Step 5: Define TypeScript Types

With the new SDK structure, you can define types inline in your controller methods or create a separate types file. Here are the recommended approaches:

**Option 1: Inline Types (Recommended for simple connectors)**

```typescript
// In src/controller/index.mts
export default class Controller extends AbstractController {
  
  async createUser(args: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    role?: string 
  }) {
    // Implementation...
  }

  async getUser(args: { userId: string }) {
    // Implementation...
  }
}
```

**Option 2: Separate Types File**

Create `src/types.ts` for complex type definitions:

```typescript
// Request parameter types
export interface CreateUserParams {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface GetUserParams {
  userId: string;
}

export interface UpdateUserParams {
  userId: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

// Response types
export interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status: string;
  created?: string;
}

// Import and use in your controller
import type { CreateUserParams, UserResponse } from '../types.js';
```

### Advanced Connector Patterns

#### Authentication Handling

With the new SDK structure, authentication is handled differently. Here are the recommended approaches:

**Option 1: Simple API Key Authentication**

```typescript
export default class Controller extends AbstractController {
  
  async createUser(args: { email: string; firstName: string; lastName: string }) {
    try {
      const apiKey = this.getConfig('API_KEY');
      
      const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(args)
      });
      
      // Handle response...
    } catch (error) {
      this.log.error('Error creating user:', error);
      throw error;
    }
  }
}
```

**Option 2: OAuth 2.0 with Token Management**

```typescript
export default class Controller extends AbstractController {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private async getValidToken(): Promise<string> {
    // Check if we have a valid access token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Try to refresh token if available
    if (this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) return this.accessToken!;
    }

    // Perform initial OAuth flow
    return await this.performOAuthFlow();
  }

  private async performOAuthFlow(): Promise<string> {
    try {
      const clientId = this.getConfig('OAUTH_CLIENT_ID');
      const clientSecret = this.getConfig('OAUTH_CLIENT_SECRET');
      const scope = this.getConfig('OAUTH_SCOPE', 'read write');

      const response = await fetch('https://api.example.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: scope
        }).toString()
      });

      if (!response.ok) {
        throw new Error(`OAuth authentication failed: ${response.statusText}`);
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000));

      this.log.info('OAuth authentication successful');
      return this.accessToken;

    } catch (error) {
      this.log.error('OAuth authentication failed:', error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const clientId = this.getConfig('OAUTH_CLIENT_ID');
      const clientSecret = this.getConfig('OAUTH_CLIENT_SECRET');

      const response = await fetch('https://api.example.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken!,
          client_id: clientId,
          client_secret: clientSecret
        }).toString()
      });

      if (!response.ok) {
        this.log.warn('Token refresh failed, will re-authenticate');
        return false;
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      if (tokenData.refresh_token) {
        this.refreshToken = tokenData.refresh_token;
      }
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000));

      this.log.info('Access token refreshed successfully');
      return true;

    } catch (error) {
      this.log.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Use the token in your methods
  async getAuthenticatedData(args: { endpoint: string }) {
    try {
      const token = await this.getValidToken();
      
      const response = await fetch(`https://api.example.com${args.endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired, clear it and retry
        this.accessToken = null;
        const newToken = await this.getValidToken();
        
        const retryResponse = await fetch(`https://api.example.com${args.endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${newToken}`
          }
        });
        
        return await retryResponse.json();
      }

      return await response.json();
    } catch (error) {
      this.log.error('Error fetching authenticated data:', error);
      throw error;
    }
  }
}
```

**Key differences from the old SDK:**
- **No base class authentication**: Handle auth logic directly in your controller methods
- **Token management**: Store tokens as private properties in your controller
- **Direct fetch calls**: Use native fetch instead of custom request methods
- **Error handling**: Handle 401 responses and token refresh in your methods

#### Error Handling and Retry Logic

Implement robust error handling:

```typescript
export default class Controller extends AbstractController {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Base delay in milliseconds

  async reliableRequest(args: any): Promise<any> {
    return await this.executeWithRetry(
      () => this.performAPICall(args),
      {
        maxRetries: this.maxRetries,
        retryDelay: this.retryDelay,
        retryCondition: (error) => this.shouldRetry(error)
      }
    );
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        this.log.debug(`Attempt ${attempt}/${options.maxRetries}`);
        return await operation();
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === options.maxRetries || !options.retryCondition(error)) {
          break;
        }
        
        const delay = this.calculateDelay(attempt, options.retryDelay);
        this.log.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
        
        await this.sleep(delay);
      }
    }
    
    this.log.error(`All ${options.maxRetries} attempts failed`);
    throw lastError!;
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    // Retry on server errors (5xx)
    if (error.status >= 500 && error.status < 600) {
      return true;
    }
    
    // Retry on rate limiting (429)
    if (error.status === 429) {
      return true;
    }
    
    // Don't retry on client errors (4xx except 429)
    return false;
  }

  private calculateDelay(attempt: number, baseDelay: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
    return Math.floor(exponentialDelay + jitter);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async performAPICall(args: any): Promise<any> {
    // Implement your API call logic here
    const response = await fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getConfig('API_KEY')}`
      },
      body: JSON.stringify(args)
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  }
}

interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  retryCondition: (error: any) => boolean;
}
```

#### Data Processing and Transformation

Handle complex data transformations:

```typescript
export default class Controller extends AbstractController {
  
  async processDataBatch(args: BatchProcessParams): Promise<BatchProcessResult> {
    this.log.info(`Processing batch of ${args.records.length} records`);
    
    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
      processedRecords: [] as any[]
    };

    // Process records in chunks to avoid memory issues
    const chunkSize = 50;
    for (let i = 0; i < args.records.length; i += chunkSize) {
      const chunk = args.records.slice(i, i + chunkSize);
      const chunkResults = await this.processChunk(chunk);
      
      results.processed += chunkResults.successful.length;
      results.failed += chunkResults.failed.length;
      results.errors.push(...chunkResults.errors);
      results.processedRecords.push(...chunkResults.successful);
      
      // Progress reporting
      const progress = Math.round(((i + chunk.length) / args.records.length) * 100);
      this.log.info(`Progress: ${progress}% (${i + chunk.length}/${args.records.length})`);
    }

    this.log.info(`Batch processing complete: ${results.processed} successful, ${results.failed} failed`);
    return results;
  }

  private async processChunk(records: any[]): Promise<ChunkResult> {
    const successful = [];
    const errors = [];
    let failed = 0;

    await Promise.all(records.map(async (record, index) => {
      try {
        // Validate record
        const validation = this.validateRecord(record);
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Transform record
        const transformed = this.transformRecord(record);

        // Process with external API
        const result = await this.processRecord(transformed);
        
        successful.push({
          originalIndex: index,
          original: record,
          transformed: transformed,
          result: result
        });

      } catch (error) {
        failed++;
        errors.push(`Record ${index}: ${error.message}`);
        this.log.error(`Failed to process record ${index}:`, error);
      }
    }));

    return { successful, failed, errors };
  }

  private validateRecord(record: any): ValidationResult {
    const errors = [];
    
    if (!record.id) errors.push('Missing required field: id');
    if (!record.email || !/\S+@\S+\.\S+/.test(record.email)) {
      errors.push('Invalid or missing email');
    }
    if (!record.name || record.name.trim().length === 0) {
      errors.push('Missing or empty name');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private transformRecord(record: any): any {
    return {
      external_id: record.id,
      email_address: record.email.toLowerCase().trim(),
      full_name: record.name.trim(),
      first_name: record.firstName?.trim() || record.name.split(' ')[0],
      last_name: record.lastName?.trim() || record.name.split(' ').slice(1).join(' '),
      phone_number: this.normalizePhoneNumber(record.phone),
      tags: this.extractTags(record),
      custom_fields: this.mapCustomFields(record),
      processed_at: new Date().toISOString()
    };
  }

  private normalizePhoneNumber(phone: string): string | null {
    if (!phone) return null;
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format US phone numbers
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+${digits}`;
    }
    
    return phone; // Return original if we can't normalize
  }

  private extractTags(record: any): string[] {
    const tags = [];
    
    if (record.category) tags.push(`category:${record.category}`);
    if (record.source) tags.push(`source:${record.source}`);
    if (record.priority) tags.push(`priority:${record.priority}`);
    
    return tags;
  }

  private mapCustomFields(record: any): Record<string, any> {
    const customFields: Record<string, any> = {};
    
    // Map known custom fields
    if (record.company) customFields.company_name = record.company;
    if (record.jobTitle) customFields.job_title = record.jobTitle;
    if (record.website) customFields.website_url = record.website;
    
    return customFields;
  }
}

interface BatchProcessParams {
  records: any[];
  options?: {
    validateOnly?: boolean;
    skipErrors?: boolean;
  };
}

interface BatchProcessResult {
  processed: number;
  failed: number;
  errors: string[];
  processedRecords: any[];
}

interface ChunkResult {
  successful: any[];
  failed: number;
  errors: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

### Building and Deployment

#### Local Development

Test your connector locally:

```bash
# Build the connector
yarn build

# Start in development mode with hot reload
yarn dev

# Run tests
yarn test

# Start production build
yarn start
```

#### Environment Configuration

Create `.env` file for local development:

```bash
# API Configuration
API_KEY=your-api-key-here
BASE_URL=https://api.example.com
TIMEOUT=30000

# OAuth Configuration (if needed)
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_SCOPE=read write

# Connector Configuration
CONNECTOR_ID=1234
REGISTRATION_KEY=your-registration-key-from-aloma

# Logging
LOG_LEVEL=info
```

#### Production Deployment

Deploy your connector to your infrastructure:

```bash
# Build for production
yarn build

# Start with PM2 (recommended for production)
npm install -g pm2
pm2 start build/index.mjs --name "my-custom-connector"

# Or use Docker
docker build -t my-custom-connector .
docker run -d --name my-connector my-custom-connector

# Monitor logs
pm2 logs my-custom-connector
# or
docker logs my-connector
```

### Using Custom Connectors in Steps

Once deployed and registered, use your custom connector in ALOMA steps:

```javascript
export const condition = {
  user: {
    email: String,
    action: "create"
  }
};

export const content = async () => {
  console.log('Creating user with custom connector...');
  
  try {
    // Use your custom connector (replace 'myCustomConnector' with your connector name)
    const newUser = await connectors.myCustomConnector.createUser({
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      role: 'user'
    });
    
    data.user.externalId = newUser.id;
    data.user.created = true;
    data.user.createdAt = newUser.created;
    
    console.log(`User created successfully: ${newUser.id}`);
    
  } catch (error) {
    console.error('User creation failed:', error.message);
    
    data.user.created = false;
    data.user.error = error.message;
    
    // Optional: Send alert for manual review
    await connectors.slackCom.send({
      channel: '#alerts',
      text: `Failed to create user ${data.user.email}: ${error.message}`
    });
  }
};
```

#### Advanced Usage Patterns

```javascript
export const condition = {
  users: Array,
  processType: "batch_update"
};

export const content = async () => {
  console.log(`Processing batch update for ${data.users.length} users`);
  
  // Use custom connector for batch processing
  const batchResult = await connectors.myCustomConnector.processDataBatch({
    records: data.users,
    options: {
      skipErrors: true,
      validateOnly: false
    }
  });
  
  data.batchResult = {
    processed: batchResult.processed,
    failed: batchResult.failed,
    successRate: Math.round((batchResult.processed / data.users.length) * 100),
    errors: batchResult.errors.slice(0, 10) // First 10 errors only
  };
  
  console.log(`Batch complete: ${batchResult.processed}/${data.users.length} successful (${data.batchResult.successRate}%)`);
  
  // Alert if high failure rate
  if (data.batchResult.successRate < 80) {
    await connectors.slackCom.send({
      channel: '#data-ops',
      text: `⚠️ Low success rate in batch processing: ${data.batchResult.successRate}%\nProcessed: ${batchResult.processed}\nFailed: ${batchResult.failed}`
    });
  }
};
```

### Management and Monitoring

#### Connector Management

Monitor and manage your custom connectors:

```bash
# List all connectors in workspace
aloma connector list

# Show details of your custom connector
aloma connector show <connector-instance-id>

# View connector logs
aloma connector logs <connector-instance-id>

# Test connector connectivity
aloma connector test <connector-instance-id>

# Update connector configuration
aloma connector update <connector-instance-id> -n "Updated Name"

# Remove connector from workspace
aloma connector delete <connector-instance-id>
```

#### Health Monitoring

Implement health checks in your connector:

```typescript
export default class Controller extends AbstractController {
  
  async healthCheck(args: any): Promise<HealthStatus> {
    const checks = {
      authentication: false,
      apiConnectivity: false,
      externalServices: false
    };

    try {
      // Check authentication by testing API key
      const apiKey = this.getConfig('API_KEY');
      checks.authentication = !!apiKey;
      
      // Check API connectivity
      const apiResponse = await fetch('https://api.example.com/health', { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      checks.apiConnectivity = apiResponse.ok;
      
      // Check external services
      checks.externalServices = await this.checkExternalServices();
      
    } catch (error) {
      this.log.error('Health check failed:', error);
    }

    const healthy = Object.values(checks).every(check => check === true);
    
    return {
      status: healthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: this.getVersion()
    };
  }

  private async checkExternalServices(): Promise<boolean> {
    // Implement checks for any external dependencies
    return true;
  }
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
  uptime: number;
  version: string;
}
```

### Best Practices

#### Security Considerations

**Credential Management** - Use environment variables, never hardcode secrets **Input Validation** - Validate all input parameters and sanitize data **Error Handling** - Don't expose sensitive information in error messages **Network Security** - Use HTTPS and validate SSL certificates **Access Control** - Implement proper authentication and authorization

#### Performance Optimization

**Connection Pooling** - Reuse HTTP connections when possible **Caching** - Cache authentication tokens and frequently accessed data **Batch Processing** - Process multiple records in single API calls **Rate Limiting** - Respect API rate limits and implement backoff strategies **Memory Management** - Handle large datasets efficiently

#### Code Organization

**Modular Design** - Separate concerns into different modules **Type Safety** - Use TypeScript for better development experience **Testing** - Write comprehensive unit and integration tests **Documentation** - Document all public methods and configuration options **Version Control** - Use semantic versioning for connector releases **ESM Modules** - Use modern ES modules with `.mts` files

Custom connectors provide unlimited flexibility for integrating ALOMA with any system or service. By following these patterns and best practices, you can build robust, maintainable connectors that seamlessly integrate with your ALOMA automations while running on your own infrastructure.

