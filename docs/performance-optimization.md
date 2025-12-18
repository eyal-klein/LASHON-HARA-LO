# Performance Optimization Plan

## Current Issues
Client reported: "חלק מהדפים נטענים באיטיות! לא טוב בכלל!"

## Optimization Strategies

### 1. Image Optimization
**Problem:** Large product images loading without optimization
**Solutions:**
- Add lazy loading to all images
- Use `loading="lazy"` attribute
- Implement image size optimization
- Add proper width/height attributes to prevent layout shift

### 2. Component Optimization
**Problem:** Heavy re-renders on homepage
**Solutions:**
- Add React.memo() to expensive components
- Use useMemo() for expensive calculations
- Optimize stats queries with proper caching

### 3. Data Fetching Optimization
**Problem:** Multiple tRPC queries on single page
**Solutions:**
- Enable tRPC query batching
- Add proper staleTime and cacheTime
- Implement prefetching for common routes

### 4. Code Splitting
**Problem:** Large bundle size
**Solutions:**
- Lazy load route components
- Split vendor bundles
- Remove unused dependencies

### 5. Database Query Optimization
**Problem:** Slow queries for products/gallery
**Solutions:**
- Add database indexes
- Optimize JOIN queries
- Implement pagination properly
- Add query result caching

## Implementation Priority

1. **HIGH**: Add lazy loading to images (immediate impact)
2. **HIGH**: Optimize tRPC queries with caching
3. **MEDIUM**: Add React.memo to components
4. **MEDIUM**: Implement code splitting
5. **LOW**: Database indexing (already fast enough)

## Quick Wins

### Lazy Loading Images
Add to all `<img>` tags:
```tsx
<img 
  src={imageSrc} 
  alt={alt}
  loading="lazy"
  className="..."
/>
```

### tRPC Query Optimization
```tsx
const { data } = trpc.products.list.useQuery(
  { page: 1, limit: 8 },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);
```

### Component Memoization
```tsx
const StatsSection = React.memo(function StatsSection() {
  // component code
});
```
