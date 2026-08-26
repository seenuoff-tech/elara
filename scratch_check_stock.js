const fs = require('fs');
const file = 'd:/elarasilver/app/product/[id]/ProductClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  const handleAddToCart = () => {`;
const replacementStr = `  const handleAddToCart = () => {
    const size = selectedSize || 'Standard';
    const existingItem = cartItems.find((item) => item.id === String(product.id) && item.size === size);
    if (existingItem && existingItem.quantity >= (product.stock || 0)) {
      alert(\`Only \${product.stock} quantity available in stock.\`);
      return;
    }`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(file, content);
