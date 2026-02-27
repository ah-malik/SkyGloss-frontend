const fs = require('fs');
const file = fs.readFileSync('src/components/LanguageSwitcher.tsx', 'utf8');
const regex = /const languages = \[([\s\S]*?)\];/;
const match = file.match(regex);
if (!match) process.exit(1);

const langsText = match[1];
const items = [];
const regexItem = /\{\s*code:\s*'([^']+)',\s*name:\s*'([^']+)',\s*flag:\s*'([^']+)'\s*\}/g;
let m;
while ((m = regexItem.exec(langsText)) !== null) {
    items.push({ code: m[1], langName: m[2], flag: m[3] });
}

const grouped = {};
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

items.forEach(item => {
    let countryCode = '';
    const cp1 = item.flag.codePointAt(0);
    const cp2 = item.flag.codePointAt(2);
    if (cp1 >= 127462 && cp1 <= 127487 && cp2 >= 127462 && cp2 <= 127487) {
        countryCode = String.fromCharCode(cp1 - 127397) + String.fromCharCode(cp2 - 127397);
    }

    let countryName = '';
    try {
        if (countryCode) countryName = regionNames.of(countryCode);
    } catch (e) { }

    if (item.flag === '🇦🇪') countryName = 'United Arab Emirates';
    if (!countryName && item.code === 'ar') countryName = 'Saudi Arabia'; // fallback

    if (!grouped[item.code]) {
        grouped[item.code] = {
            code: item.code,
            langName: item.langName,
            countries: [],
            flags: []
        };
    }
    if (countryName && !grouped[item.code].countries.includes(countryName)) {
        grouped[item.code].countries.push(countryName);
    }
    if (!grouped[item.code].flags.includes(item.flag)) {
        grouped[item.code].flags.push(item.flag);
    }
});

const outArray = Object.values(grouped).sort((a, b) => a.langName.localeCompare(b.langName));

const newLangsText = "\n" + outArray.map(g => {
    const flagsStr = g.flags.slice(0, 3).join('') + (g.flags.length > 3 ? '+' : '');
    const cStr = g.countries.join(', ').replace(/'/g, "\\'");
    return `    { code: '${g.code}', name: '${g.langName}', flags: '${flagsStr}', countries: '${cStr}' }`;
}).join(",\n") + "\n";

fs.writeFileSync('src/components/LanguageSwitcher.tsx', file.replace(match[1], newLangsText));
console.log('done');
