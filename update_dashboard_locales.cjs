const fs = require('fs');

const enJsonPath = 'frontend/src/locales/en.json';
const siJsonPath = 'frontend/src/locales/si.json';
const taJsonPath = 'frontend/src/locales/ta.json';

const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const siData = JSON.parse(fs.readFileSync(siJsonPath, 'utf8'));
const taData = JSON.parse(fs.readFileSync(taJsonPath, 'utf8'));

// Inject new notifications in "dashboard" section
const addNotifications = (data, translations) => {
  if (!data.dashboard) data.dashboard = {};
  data.dashboard.notifications = translations;
};

addNotifications(enData, {
  "licenseExpiry": "Your license is nearing expiry. Please renew it before next month.",
  "twoDaysAgo": "2 days ago",
  "driveSafe": "Drive safe! Make sure to follow traffic rules to avoid penalties.",
  "oneWeekAgo": "1 week ago"
});

addNotifications(siData, {
  "licenseExpiry": "ඔබගේ රියදුරු බලපත්‍රයේ කල් ඉකුත් වීමේ දිනය ආසන්නයි. කරුණාකර ලබන මාසයට පෙර එය අලුත් කරන්න.",
  "twoDaysAgo": "දින 2 කට පෙර",
  "driveSafe": "ආරක්ෂිතව රිය පදවන්න! දඩ මුදල් වළක්වා ගැනීම සඳහා රථවාහන නීති අනුගමනය කිරීමට වග බලා ගන්න.",
  "oneWeekAgo": "සතියකට පෙර"
});

addNotifications(taData, {
  "licenseExpiry": "உங்கள் ஓட்டுநர் உரிமம் காலாவதியாகும் நிலையில் உள்ளது. அடுத்த மாதத்திற்கு முன் புதுப்பிக்கவும்.",
  "twoDaysAgo": "2 நாட்களுக்கு முன்",
  "driveSafe": "பாதுகாப்பாக ஓட்டவும்! அபராதங்களை தவிர்க்க போக்குவரத்து விதிகளை பின்பற்றுவதை உறுதி செய்யவும்.",
  "oneWeekAgo": "1 வாரத்திற்கு முன்"
});

fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2), 'utf8');
fs.writeFileSync(siJsonPath, JSON.stringify(siData, null, 2), 'utf8');
fs.writeFileSync(taJsonPath, JSON.stringify(taData, null, 2), 'utf8');

console.log("Dashboard notifications translations injected successfully!");
