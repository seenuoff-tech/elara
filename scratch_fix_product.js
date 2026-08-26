const fs = require('fs');
const file = 'd:/elarasilver/app/product/[id]/ProductClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const policyStart = content.indexOf('{/* Policy Dropdowns');
const policyEnd = content.indexOf('            {/* Product Description Expandable */}');
const descStart = policyEnd;
const descEnd = content.indexOf('          </div>\n        </div>\n      </div>');

const policyBlock = content.substring(policyStart, policyEnd);
const descBlock = content.substring(descStart, descEnd);

content = content.substring(0, policyStart) + descBlock + '\n            ' + policyBlock + content.substring(descEnd);

content = content.replace(/activePolicyTab: 'terms' \| 'refund' \| 'return' \| null/, "activePolicyTab: 'terms' | 'refund' | 'return' | 'care' | null");

const careButton = `
                <button
                  onClick={() => setActivePolicyTab(activePolicyTab === 'care' ? null : 'care')}
                  className={\`py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors \${
                    activePolicyTab === 'care'
                      ? 'bg-white text-[#0B5E64] shadow-sm'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100/50'
                  }\`}
                >
                  <svg className="w-4 h-4 shrink-0 text-[#0B5E64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="truncate">Jewellery Care</span>
                  <svg className={\`w-3.5 h-3.5 transition-transform duration-200 \${activePolicyTab === 'care' ? 'rotate-180 text-[#0B5E64]' : 'text-gray-400'}\`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
`;

content = content.replace('className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/80"', 'className="grid grid-cols-4 border-b border-gray-200 bg-gray-50/80"');
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
const returnPolicyBlockEnd = content.indexOf('</div>\n                  )}', content.indexOf('{activePolicyTab === \'return\' && (')) + 26;
content = content.substring(0, returnPolicyBlockEnd) + '\n' + careContent + content.substring(returnPolicyBlockEnd);

content = content.replace('src={gallery[activeImageIndex]?.url || gallery[0]?.url}', 'src={ (finishes[selectedFinish] && finishes[selectedFinish].image && activeImageIndex === 0) ? finishes[selectedFinish].image : (gallery[activeImageIndex]?.url || gallery[0]?.url) }');

fs.writeFileSync(file, content);
console.log('done');
