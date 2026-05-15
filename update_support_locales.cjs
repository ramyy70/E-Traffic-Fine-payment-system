const fs = require('fs');

const enJsonPath = 'frontend/src/locales/en.json';
const siJsonPath = 'frontend/src/locales/si.json';
const taJsonPath = 'frontend/src/locales/ta.json';

const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const siData = JSON.parse(fs.readFileSync(siJsonPath, 'utf8'));
const taData = JSON.parse(fs.readFileSync(taJsonPath, 'utf8'));

const enTranslations = {
  "title": "Need Help?",
  "faq": {
    "title": "FAQ & Guidelines",
    "item1": "Click <1>Pay Now</1> securely via your card portal.",
    "item2": "Fines over 14 days old mark as <1>Overdue</1> natively.",
    "item3": "Show the Police the green <1>Paid</1> badge directly on scene.",
    "item4": "QR Scan redirects straight against your local Fine tracking ID natively."
  },
  "contact": {
    "title": "Contact Support & Report Issue",
    "subtitle": "Message the admins directly addressing any dispute directly.",
    "formTitle": "Send Admin Message",
    "placeholder": "Explain your situation...",
    "cancel": "Cancel",
    "send": "Send Issue"
  },
  "emergency": "Emergency Helpline"
};

const siTranslations = {
  "title": "උදව් අවශ්‍යද?",
  "faq": {
    "title": "නිතර අසන පැන සහ මාර්ගෝපදේශ",
    "item1": "ඔබගේ කාඩ්පත් ද්වාරය හරහා ආරක්ෂිතව <1>දැන් ගෙවන්න</1> ක්ලික් කරන්න.",
    "item2": "දින 14 කට වඩා පැරණි දඩ මුදල් <1>කල් ඉකුත් වූ</1> ලෙස සලකුණු වේ.",
    "item3": "හරිත <1>ගෙවන ලද</1> ලාංඡනය පොලිසියට පෙන්වන්න.",
    "item4": "QR ස්කෑන් කිරීම මඟින් ඔබගේ දඩ ලුහුබැඳීමේ හැඳුනුම්පත වෙත යොමු කෙරේ."
  },
  "contact": {
    "title": "සහාය අමතන්න සහ ගැටළුව වාර්තා කරන්න",
    "subtitle": "ඕනෑම ආරවුලක් සම්බන්ධයෙන් සෘජුවම පරිපාලකවරුන්ට පණිවිඩයක් යවන්න.",
    "formTitle": "පරිපාලක පණිවිඩය යවන්න",
    "placeholder": "ඔබගේ තත්වය පැහැදිලි කරන්න...",
    "cancel": "අවලංගු කරන්න",
    "send": "යවන්න"
  },
  "emergency": "හදිසි උපකාරක සේවාව"
};

const taTranslations = {
  "title": "உதவி தேவையா?",
  "faq": {
    "title": "அடிக்கடி கேட்கப்படும் கேள்விகள் & வழிகாட்டுதல்கள்",
    "item1": "உங்கள் அட்டை போர்டல் மூலம் பாதுகாப்பாக <1>இப்போது செலுத்துக</1> என்பதை கிளிக் செய்யவும்.",
    "item2": "14 நாட்களுக்கு மேற்பட்ட அபராதங்கள் <1>காலாவதியானவை</1> என குறிக்கப்படும்.",
    "item3": "பச்சை நிற <1>செலுத்தப்பட்ட</1> பேட்ஜை போலீசாரிடம் காண்பிக்கவும்.",
    "item4": "QR ஸ்கேன் உங்கள் அபராத கண்காணிப்பு அடையாளத்திற்கு திருப்பி விடும்."
  },
  "contact": {
    "title": "ஆதரவை தொடர்பு கொள்ளவும் & சிக்கலை தெரிவிக்கவும்",
    "subtitle": "ஏதேனும் பிரச்சினை இருந்தால் நேரடியாக நிர்வாகிகளுக்கு செய்தி அனுப்பவும்.",
    "formTitle": "நிர்வாகி செய்தியை அனுப்பவும்",
    "placeholder": "உங்கள் நிலையை விளக்கவும்...",
    "cancel": "ரத்துசெய்",
    "send": "அனுப்பு"
  },
  "emergency": "அவசர உதவி மையம்"
};

enData.support = enTranslations;
siData.support = siTranslations;
taData.support = taTranslations;

fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2), 'utf8');
fs.writeFileSync(siJsonPath, JSON.stringify(siData, null, 2), 'utf8');
fs.writeFileSync(taJsonPath, JSON.stringify(taData, null, 2), 'utf8');

console.log("Support translations injected successfully!");
