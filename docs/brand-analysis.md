# Brand Analysis - לשון הרע לא מדבר אליי

## Critical Issues Found

### 1. Color Violations
**Problem:** Current V2 site uses purple/pink gradient backgrounds that are NOT in the brand book.

**Brand Colors (from brand book):**
- Primary Red: #ED1C24 (or similar red tone)
- Black: For text "לשון הרע" and "לא מדבר אליי"
- White: For backgrounds and clean design
- Light gray/beige: For subtle backgrounds (as seen in brand book pages)

**What to Remove:**
- All purple/pink gradient backgrounds (currently in HomeNew.tsx hero section)
- Any magenta/violet colors

**What to Use:**
- Red (#ED1C24) for primary elements
- White backgrounds
- Black for text
- Light gray for subtle sections

### 2. Duplicate Logo Issue
**Problem:** Logo appears twice on homepage
- Once in header/navigation
- Once in hero section

**Solution:** Keep logo only in header, remove from hero section

### 3. Performance Issues
Pages loading slowly - need to optimize:
- Image loading (lazy loading)
- Component rendering
- Database queries

### 4. Donation Page Not Connected
"תמיכה כספית" button should link to /donate page

### 5. Store Design Mismatch
Current store doesn't match original lashonhara.co.il design:
- Need to replicate exact layout
- Product grid style
- Category filtering
- Product cards design

## Original Site Store Analysis (lashonhara.co.il/shop-m/)

**Layout:**
- Featured products carousel at top
- Product grid below
- Simple white background
- Red accents for CTAs
- Product cards with:
  - Product image
  - Product name
  - Price in ₪
  - "לקניה >>>" button in red

**Categories visible:**
- צמידי סיליקון
- טבעות סיליקון
- טבעות בציפוי זהב וכסף
- מוצרי ספורט
- מוצרים מיוחדים ומדליקים
- מחזיקי מפתחות

**Design Elements:**
- Clean, minimal design
- White background
- Red (#ED1C24) for buttons and accents
- Simple typography
- No purple/pink colors anywhere!

## Action Items

1. ✅ Remove all purple/pink gradients from HomeNew.tsx
2. ✅ Fix duplicate logo (remove from hero, keep in header)
3. ✅ Connect /donate route to donation page
4. ✅ Optimize image loading and performance
5. ✅ Redesign store to match original site exactly
