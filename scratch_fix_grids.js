const fs = require('fs');

function replaceInFile(file, oldStr, newStr) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(file, content);
  }
}

// 1. NewArrivals
replaceInFile(
  'd:/elarasilver/components/NewArrivals.tsx',
  `price: product.newPrice ? \`₹\${product.newPrice}\` : (product.price ? \`₹\${product.price}\` : calculatePrice(product.weightInGrams || 0, product.category)),
        image: product.image,
      } as any`,
  `price: product.newPrice ? \`₹\${product.newPrice}\` : (product.price ? \`₹\${product.price}\` : calculatePrice(product.weightInGrams || 0, product.category)),
        image: product.image,
        stock: product.stock
      } as any`
);

// 2. SimilarProducts
replaceInFile(
  'd:/elarasilver/components/SimilarProducts.tsx',
  `price: product.newPrice ? \`₹\${product.newPrice}\` : (product.price ? \`₹\${product.price}\` : calculatePrice(product.weightInGrams || 0, product.category)),
        image: product.image,
      } as any`,
  `price: product.newPrice ? \`₹\${product.newPrice}\` : (product.price ? \`₹\${product.price}\` : calculatePrice(product.weightInGrams || 0, product.category)),
        image: product.image,
        stock: product.stock
      } as any`
);

// 3. ShopPage
replaceInFile(
  'd:/elarasilver/app/shop/page.tsx',
  `price: finalPriceStr,
        image: product.image
      }`,
  `price: finalPriceStr,
        image: product.image,
        stock: product.stock
      }`
);
