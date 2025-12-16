# Cloud Run Node.js Best Practices

## Key Findings from Official Documentation

### 1. Start app using `node` instead of `npm`
- Use `CMD node index.js` in Dockerfile instead of `npm start`
- npm adds extra latency

### 2. Bundle your code
- Use bundlers like esbuild (which we already use)
- Tree shaking, minification, coalescing small files

### 3. Lazy load dependencies
- Don't import all dependencies at startup
- Use dynamic imports for non-critical dependencies

### 4. Configure timeout
- Node.js default timeout is 2 minutes
- Use `server.setTimeout(0)` for unlimited timeout (rely on Cloud Run's timeout)

## Dockerfile Best Practices

```dockerfile
# Use node directly, not npm
CMD ["node", "dist/index.js"]

# Listen on 0.0.0.0 and PORT env variable
# PORT is provided by Cloud Run
```

## Key Requirements
1. Container MUST listen on the PORT environment variable
2. Container MUST bind to 0.0.0.0 (not localhost)
3. Container MUST respond to health checks within timeout
