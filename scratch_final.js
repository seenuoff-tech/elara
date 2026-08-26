const fs = require('fs');
const file = 'd:/elarasilver/app/product/[id]/ProductClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add states for swipe
content = content.replace('const [activeImageIndex, setActiveImageIndex] = useState(0);', 'const [activeImageIndex, setActiveImageIndex] = useState(0);\n  const [touchStart, setTouchStart] = useState(0);\n  const [touchEnd, setTouchEnd] = useState(0);');

const swipeLogic = `
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && activeImageIndex < gallery.length - 1) setActiveImageIndex(activeImageIndex + 1);
    if (distance < -50 && activeImageIndex > 0) setActiveImageIndex(activeImageIndex - 1);
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

// Fix image source for finish
content = content.replace('src={gallery[activeImageIndex]?.url || gallery[0]?.url}', 'src={ (finishes[selectedFinish] && finishes[selectedFinish].image && activeImageIndex === 0) ? finishes[selectedFinish].image : (gallery[activeImageIndex]?.url || gallery[0]?.url) }');

// Add care policy
content = content.replace(/activePolicyTab: 'terms' \| 'refund' \| 'return' \| null/, "activePolicyTab: 'terms' | 'refund' | 'return' | 'care' | null");
content = content.replace('className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/80"', 'className="grid grid-cols-4 border-b border-gray-200 bg-gray-50/80"');

const careButton = `
                <button
                  onClick={() => setActivePolicyTab(activePolicyTab === 'care' ? null : 'care')}
                  className={\`py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-l border-gray-200 \${
                    activePolicyTab === 'care'
                      ? 'bg-white text-[#0B5E64] shadow-sm'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100/50'
                  }\`}
                >
                  <svg className="w-4 h-4 shrink-0 text-[#0B5E64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="truncate">Jewellery Care</span>
                </button>
`;

const returnBtnEnd = content.indexOf('</button>', content.indexOf('Return Policy')) + 9;
content = content.substring(0, returnBtnEnd) + '\n' + careButton + content.substring(returnBtnEnd);

const careContent = `
                  {activePolicyTab === 'care' && (
                    <div className="space-y-3">
                      <ul className="space-y-2 list-disc list-inside text-gray-700">
                        <li>Store your silver jewellery in a cool, dry place, preferably in an airtight zip lock bag.</li>
                        <li>Avoid direct contact with perfumes, lotions, and harsh chemicals.</li>
                        <li>Clean gently with a soft polishing cloth to maintain its shine.</li>
                      </ul>
                    </div>
                  )}
`;
const returnRegex = /Read Full Return Policy[\s\S]*?<\/svg>\s*<\/Link>\s*<\/div>\s*<\/div>\s*\)}/;
const match = content.match(returnRegex);
if (match) {
  content = content.replace(returnRegex, match[0] + '\n' + careContent);
}

// Move description
const policyStart = content.indexOf('{/* Policy Dropdowns (Terms & Conditions');
const descStart = content.indexOf('{/* Product Description Expandable */}');
const descEnd = content.indexOf('          </div>\n        </div>\n      </div>');

const policyBlock = content.substring(policyStart, descStart);
const descBlock = content.substring(descStart, descEnd);

content = content.substring(0, policyStart) + descBlock + '\n            ' + policyBlock + content.substring(descEnd);

fs.writeFileSync(file, content);
