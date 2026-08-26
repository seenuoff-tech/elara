const fs = require('fs');
const file = 'd:/elarasilver/app/product/[id]/ProductClient.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [touchStart, setTouchStart] = useState(0);')) {
  content = content.replace('const [activeImageIndex, setActiveImageIndex] = useState(0);', 'const [activeImageIndex, setActiveImageIndex] = useState(0);\n  const [touchStart, setTouchStart] = useState(0);\n  const [touchEnd, setTouchEnd] = useState(0);');
  
  const swipeLogic = `
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe && activeImageIndex < gallery.length - 1) setActiveImageIndex(activeImageIndex + 1);
    if (isRightSwipe && activeImageIndex > 0) setActiveImageIndex(activeImageIndex - 1);
    setTouchStart(0);
    setTouchEnd(0);
  };
  `;
  
  content = content.replace('  // Parse sizes', swipeLogic + '\n  // Parse sizes');
  
  content = content.replace('<div className="aspect-[4/5] md:aspect-square relative bg-gray-50 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">', '<div \n              className="aspect-[4/5] md:aspect-square relative bg-gray-50 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden"\n              onTouchStart={handleTouchStart}\n              onTouchMove={handleTouchMove}\n              onTouchEnd={handleTouchEnd}\n            >');
  
  const dots = `
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 md:hidden">
                {gallery.map((_, idx) => (
                  <div key={idx} className={\`w-2 h-2 rounded-full \${idx === activeImageIndex ? 'bg-[#0B5E64]' : 'bg-gray-300'}\`} />
                ))}
              </div>
  `;
  
  content = content.replace('              <button \n                onClick={() => document.getElementById(\'similar-products\')', dots + '\n              <button \n                onClick={() => document.getElementById(\'similar-products\')');
  
  fs.writeFileSync(file, content);
  console.log('Swipe logic added');
} else {
  console.log('Already added');
}
