#!/bin/bash

# Convert all product images to WebP format
# This script converts JPG/PNG images to WebP with 85% quality

SOURCE_DIR="/home/ubuntu/lashonhara-v2/client/public/products"
BACKUP_DIR="/home/ubuntu/lashonhara-v2/client/public/products_backup"

echo "🖼️  WebP Image Conversion Script"
echo "================================"

# Create backup directory
if [ ! -d "$BACKUP_DIR" ]; then
  echo "📁 Creating backup directory..."
  mkdir -p "$BACKUP_DIR"
fi

# Count images
TOTAL=$(find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | wc -l)
echo "📊 Found $TOTAL images to convert"

CONVERTED=0
SKIPPED=0
ERRORS=0

# Convert images
for img in "$SOURCE_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  # Skip if file doesn't exist (glob didn't match)
  [ -e "$img" ] || continue
  
  filename=$(basename "$img")
  name="${filename%.*}"
  ext="${filename##*.}"
  webp_file="$SOURCE_DIR/${name}.webp"
  
  # Skip if WebP already exists
  if [ -f "$webp_file" ]; then
    echo "⏭️  Skipping $filename (WebP exists)"
    ((SKIPPED++))
    continue
  fi
  
  # Backup original
  cp "$img" "$BACKUP_DIR/"
  
  # Convert to WebP
  if cwebp -q 85 "$img" -o "$webp_file" > /dev/null 2>&1; then
    echo "✅ Converted: $filename → ${name}.webp"
    ((CONVERTED++))
    # Remove original after successful conversion
    rm "$img"
  else
    echo "❌ Failed: $filename"
    ((ERRORS++))
  fi
done

echo ""
echo "================================"
echo "📈 Conversion Summary:"
echo "   ✅ Converted: $CONVERTED"
echo "   ⏭️  Skipped: $SKIPPED"
echo "   ❌ Errors: $ERRORS"
echo "   📊 Total: $TOTAL"
echo "   💾 Backups: $BACKUP_DIR"
echo "================================"
