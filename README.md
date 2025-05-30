# STN API Sample Project

This is a sample project demonstrating how to integrate with the STN API. It includes a basic Node.js server with TypeScript that handles webhook events and provides example API interactions.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- A Screen Time Network account with API access

## Setup

1. Clone this repository:

```bash
git clone [repository-url]
cd stn-api-sample
```

2. Install dependencies:

```bash
npm install
```

3. Configure your API credentials:

   - Get your API key from The Screen Time Network dashboard
   - Get your webhook secret from the The Screen Time Network dashboard
   - Fill in the constants at the top of server.ts

   ```
   API_KEY=your_api_key_here
   WEBHOOK_SECRET=your_webhook_secret_here
   YOUR_HANDLE=your_stn_handle
   ```

4. Build and Run the server

   ```
   npm start
   ```

### Development Mode

To run the server in development mode with hot reloading:

```bash
npm run dev
```

## Webhook Testing

To test webhooks locally, the project uses localtunnel to create a public URL. The server will automatically create a tunnel and log the URL when started.
