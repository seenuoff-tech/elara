const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /price: product\.newPrice \? `₹\${product\.newPrice}` : \(product\.price \? `₹\${product\.price}` : calculatePrice\(product\.weightInGrams \|\| 0, product\.category\)\),?\s*image: product\.image,?\s*}/g,
    `price: product.newPrice ? \`₹\${product.newPrice}\` : (product.price ? \`₹\${product.price}\` : calculatePrice(product.weightInGrams || 0, product.category)),
        image: product.image,
        stock: product.stock
      }`
  );
  fs.writeFileSync(file, content);
}

fixFile('d:/elarasilver/components/NewArrivals.tsx');
fixFile('d:/elarasilver/components/SimilarProducts.tsx');
fixFile('d:/elarasilver/app/shop/page.tsx');
