const fs = require('fs');
const file = 'd:/elarasilver/app/product/[id]/ProductClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement1 = `const { triggerPackagingAnimation, setIsGiftWrap, addToCartDirect, cartItems } = useCart();

  const handleBuyNow = () => {
    const size = selectedSize || 'Standard';
    const existingItem = cartItems.find((item) => item.id === String(product.id) && item.size === size);
    if (existingItem && existingItem.quantity >= (product.stock || 0)) {
      alert(\`Only \${product.stock} quantity available in stock.\`);
      router.push('/checkout');
      return;
    }

    addToCartDirect({
      id: String(product.id),
      name: product.name,
      price: product.newPrice ? \`₹\${product.newPrice}\` : (product.price ? \`₹\${product.price}\` : calculatePrice(product.weightInGrams || 0, product.category)),
      image: product.image,
      stock: product.stock
    }, size);
    
    if (isGift) {
      setIsGiftWrap(true);
    }
    router.push('/checkout');
  };`;

content = content.replace('const { triggerPackagingAnimation, setIsGiftWrap } = useCart();', replacement1);

const targetButton = `<button 
                  disabled={isOutOfStock}
                  className={\`flex-1 py-3 border font-bold tracking-widest uppercase rounded-lg transition-colors \${`;

const replacementButton = `<button 
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={\`flex-1 py-3 border font-bold tracking-widest uppercase rounded-lg transition-colors \${`;

content = content.replace(targetButton, replacementButton);

fs.writeFileSync(file, content);
