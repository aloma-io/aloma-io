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

#### Step 1: Register Your Connector

Create a connector registration in ALOMA to get your connector ID:

```bash
# Login to ALOMA and navigate to connector registration
# Register new connector and note the connector ID (e.g., 1234)
aloma connector list-available --private
```

The registration process provides you with a unique connector ID that links your custom connector to ALOMA workspaces.

#### Step 2: Initialize Connector Project

Create a new connector project using the ALOMA Integration SDK:

```bash
# Create connector with your registered ID
npx @aloma.io/integration-sdk@latest create my-custom-connector --connector-id 1234

# Navigate to project directory
cd my-custom-connector

# Install dependencies
yarn install
```

This generates a complete connector project with TypeScript configuration, development tools, and example code.

#### Step 3: Basic Connector Structure

Understand the generated project structure:

```
my-custom-connector/
├── src/
│   ├── connector.ts      # Main connector logic
│   ├── types.ts         # TypeScript type definitions
│   └── handlers/        # Request handlers
├── package.json         # Project configuration
├── tsconfig.json       # TypeScript configuration
├── .env.example        # Environment variables template
└── README.md           # Connector documentation
```

#### Step 4: Implement Connector Logic

Edit `src/connector.ts` to implement your integration:

```typescript
import { AlomaConnector, RequestHandler } from '@aloma.io/integration-sdk';

export class CustomAPIConnector extends AlomaConnector {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    super();
    this.apiKey = this.getConfig('API_KEY');
    this.baseUrl = this.getConfig('BASE_URL', 'https://api.example.com');
  }

  // Handle authentication
  protected async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      this.log.error('Authentication failed:', error);
      return false;
    }
  }

  // Define connector methods
  @RequestHandler('createUser')
  async createUser(params: CreateUserParams): Promise<UserResponse> {
    this.log.info('Creating user:', params.email);
    
    const response = await this.makeRequest('/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        role: params.role || 'user'
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
  }

  @RequestHandler('getUser')
  async getUser(params: GetUserParams): Promise<UserResponse> {
    this.log.info('Fetching user:', params.userId);
    
    const response = await this.makeRequest(`/users/${params.userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      throw new Error(`User not found: ${params.userId}`);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const userData = await response.json();
    
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      status: userData.status
    };
  }

  @RequestHandler('updateUser')
  async updateUser(params: UpdateUserParams): Promise<UserResponse> {
    this.log.info('Updating user:', params.userId);
    
    const updateData: any = {};
    if (params.firstName) updateData.first_name = params.firstName;
    if (params.lastName) updateData.last_name = params.lastName;
    if (params.role) updateData.role = params.role;
    if (params.status) updateData.status = params.status;

    const response = await this.makeRequest(`/users/${params.userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`User update failed: ${response.statusText}`);
    }

    const userData = await response.json();
    
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      status: userData.status
    };
  }

  @RequestHandler('listUsers')
  async listUsers(params: ListUsersParams = {}): Promise<UsersListResponse> {
    this.log.info('Listing users with filters:', params);
    
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const url = `/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await this.makeRequest(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to list users: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      users: data.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status
      })),
      total: data.total,
      limit: data.limit,
      offset: data.offset
    };
  }

  // Helper method for API requests
  private async makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 30000, // 30 second timeout
      });
      
      // Log request details for debugging
      this.log.debug(`${options.method || 'GET'} ${url} -> ${response.status}`);
      
      return response;
    } catch (error) {
      this.log.error(`Request failed: ${options.method || 'GET'} ${url}`, error);
      throw error;
    }
  }
}
```

#### Step 5: Define TypeScript Types

Create type definitions in `src/types.ts`:

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

export interface ListUsersParams {
  role?: string;
  status?: string;
  limit?: number;
  offset?: number;
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

export interface UsersListResponse {
  users: UserResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Configuration types
export interface ConnectorConfig {
  API_KEY: string;
  BASE_URL?: string;
  TIMEOUT?: number;
  RETRY_ATTEMPTS?: number;
}
```

### Advanced Connector Patterns

#### Authentication Handling

Implement different authentication strategies:

```typescript
export class AdvancedAPIConnector extends AlomaConnector {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: Date | null = null;

  // OAuth 2.0 authentication flow
  protected async authenticate(): Promise<boolean> {
    const authType = this.getConfig('AUTH_TYPE', 'api_key');
    
    switch (authType) {
      case 'oauth2':
        return await this.authenticateOAuth2();
      case 'jwt':
        return await this.authenticateJWT();
      case 'api_key':
        return await this.authenticateAPIKey();
      default:
        throw new Error(`Unsupported authentication type: ${authType}`);
    }
  }

  private async authenticateOAuth2(): Promise<boolean> {
    try {
      // Check if we have a valid access token
      if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return true;
      }

      // Try to refresh token if available
      if (this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) return true;
      }

      // Perform initial OAuth flow
      const clientId = this.getConfig('OAUTH_CLIENT_ID');
      const clientSecret = this.getConfig('OAUTH_CLIENT_SECRET');
      const scope = this.getConfig('OAUTH_SCOPE', 'read write');

      const response = await this.makeRequest('/oauth/token', {
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
      return true;

    } catch (error) {
      this.log.error('OAuth authentication failed:', error);
      return false;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const clientId = this.getConfig('OAUTH_CLIENT_ID');
      const clientSecret = this.getConfig('OAUTH_CLIENT_SECRET');

      const response = await this.makeRequest('/oauth/token', {
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
      return false;
    }
  }

  // Override makeRequest to include authentication
  protected async makeAuthenticatedRequest(endpoint: string, options: RequestInit): Promise<Response> {
    // Ensure we're authenticated
    const isAuthenticated = await this.authenticate();
    if (!isAuthenticated) {
      throw new Error('Authentication failed');
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`,
    };

    const response = await this.makeRequest(endpoint, {
      ...options,
      headers
    });

    // Handle token expiration
    if (response.status === 401) {
      this.log.warn('Received 401, attempting to re-authenticate');
      this.accessToken = null; // Force re-authentication
      
      const retryAuth = await this.authenticate();
      if (retryAuth) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        return await this.makeRequest(endpoint, { ...options, headers });
      }
    }

    return response;
  }
}
```

#### Error Handling and Retry Logic

Implement robust error handling:

```typescript
export class ResilientAPIConnector extends AlomaConnector {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Base delay in milliseconds

  @RequestHandler('reliableRequest')
  async reliableRequest(params: any): Promise<any> {
    return await this.executeWithRetry(
      () => this.performAPICall(params),
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
export class DataProcessingConnector extends AlomaConnector {
  @RequestHandler('processDataBatch')
  async processDataBatch(params: BatchProcessParams): Promise<BatchProcessResult> {
    this.log.info(`Processing batch of ${params.records.length} records`);
    
    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
      processedRecords: [] as any[]
    };

    // Process records in chunks to avoid memory issues
    const chunkSize = 50;
    for (let i = 0; i < params.records.length; i += chunkSize) {
      const chunk = params.records.slice(i, i + chunkSize);
      const chunkResults = await this.processChunk(chunk);
      
      results.processed += chunkResults.successful.length;
      results.failed += chunkResults.failed.length;
      results.errors.push(...chunkResults.errors);
      results.processedRecords.push(...chunkResults.successful);
      
      // Progress reporting
      const progress = Math.round(((i + chunk.length) / params.records.length) * 100);
      this.log.info(`Progress: ${progress}% (${i + chunk.length}/${params.records.length})`);
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
pm2 start dist/index.js --name "my-custom-connector"

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
    // Use your custom connector (replace 'myCustomAPI' with your connector namespace)
    const newUser = await connectors.myCustomAPI.createUser({
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
  const batchResult = await connectors.myCustomAPI.processDataBatch({
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

#### Connector CLI Management

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
export class MonitoredConnector extends AlomaConnector {
  @RequestHandler('healthCheck')
  async healthCheck(): Promise<HealthStatus> {
    const checks = {
      authentication: false,
      apiConnectivity: false,
      database: false,
      externalServices: false
    };

    try {
      // Check authentication
      checks.authentication = await this.authenticate();
      
      // Check API connectivity
      const apiResponse = await this.makeRequest('/health', { method: 'GET' });
      checks.apiConnectivity = apiResponse.ok;
      
      // Check database connectivity (if applicable)
      if (this.database) {
        checks.database = await this.database.ping();
      }
      
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

**Modular Design** - Separate concerns into different modules **Type Safety** - Use TypeScript for better development experience **Testing** - Write comprehensive unit and integration tests **Documentation** - Document all public methods and configuration options **Version Control** - Use semantic versioning for connector releases

Custom connectors provide unlimited flexibility for integrating ALOMA with any system or service. By following these patterns and best practices, you can build robust, maintainable connectors that seamlessly integrate with your ALOMA automations while running on your own infrastructure.
