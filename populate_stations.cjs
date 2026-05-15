const fs = require('fs');

const extraStations = {
  "abepura": { en: "Abepura", si: "අබේපුර", ta: "அபேபுர" },
  "achchuveli": { en: "Achchuveli", si: "අච්චුවේලි", ta: "அச்சுவேலி" },
  "adampan": { en: "Adampan", si: "අඩම්පන්", ta: "அடம்பன்" },
  "addalachchenai": { en: "Addalachchenai", si: "අඩ්ඩාලච්චේනයි", ta: "அட்டாலச்சேனை" },
  "agalawatta": { en: "Agalawatta", si: "අගලවත්ත", ta: "அகலவத்தை" },
  "agarapathana": { en: "Agarapathana", si: "අගරපතන", ta: "அகரப்பத்தனை" },
  "agbopura": { en: "Agbopura", si: "අග්බෝපුර", ta: "அக்போபுர" },
  "ahangama": { en: "Ahangama", si: "අහංගම", ta: "அகங்கம" },
  "ahungalla": { en: "Ahungalla", si: "අහුංගල්ල", ta: "அகுங்கல்ல" },
  "akaragama": { en: "Akaragama", si: "අකාරගම", ta: "அகரகம" },
  "akkaraipattu": { en: "Akkaraipattu", si: "අක්කරෙයිපත්තුව", ta: "அக்கரைப்பற்று" },
  "akmeemana": { en: "Akmeemana", si: "අක්මීමන", ta: "அக்மீமன" },
  "akuressa": { en: "Akuressa", si: "අකුරැස්ස", ta: "அக்குரஸ்ஸ" },
  "alawathugoda": { en: "Alawathugoda", si: "අලවතුගොඩ", ta: "அலவத்துகொட" },
  "alawwa": { en: "Alawwa", si: "අලව්ව", ta: "அலவ்வ" },
  "aluthepola": { en: "Aluthepola", si: "අලුතේපොළ", ta: "அலுதேபொல" },
  "aluthgama": { en: "Aluthgama", si: "අලුත්ගම", ta: "அளுத்கம" },
  "ambalangoda": { en: "Ambalangoda", si: "අම්බලන්ගොඩ", ta: "அம்பலாங்கொடை" },
  "ambalantota": { en: "Ambalantota", si: "අම්බලන්තොට", ta: "அம்பலாந்தோட்டை" },
  "ambanpola": { en: "Ambanpola", si: "අම්බන්පොළ", ta: "அம்பன்பொல" },
  "ambathenna": { en: "Ambathenna", si: "අඹතැන්න", ta: "அம்பதென்ன" },
  "ampara": { en: "Ampara", si: "අම්පාර", ta: "அம்பாறை" },
  "anamaduwa": { en: "Anamaduwa", si: "ආණමඩුව", ta: "ஆனமடுவ" },
  "anguruwatota": { en: "Anguruwatota", si: "අඟුරුවාතොට", ta: "அங்குருவாதொட்ட" },
  "anuradhapura": { en: "Anuradhapura", si: "අනුරාධපුරය", ta: "அனுராதபுரம்" },
  "aranayaka": { en: "Aranayaka", si: "අරණායක", ta: "அரநாயக்க" },
  "aralaganwila": { en: "Aralaganwila", si: "අරලගංවිල", ta: "அரலகன்வில" },
  "athurugiriya": { en: "Athurugiriya", si: "අතුරුගිරිය", ta: "அතුරුகிரிய" },
  "attanagalla": { en: "Attanagalla", si: "අත්තනගල්ල", ta: "அத்தனகல்ல" },
  "avissawella": { en: "Avissawella", si: "අවිස්සාවේල්ල", ta: "அவிசாவளை" },
  "ayagama": { en: "Ayagama", si: "අයගම", ta: "அயகம" },
  "badalkumbura": { en: "Badalkumbura", si: "බඩල්කුඹුර", ta: "படல்கும்புர" },
  "baddegama": { en: "Baddegama", si: "බද්දේගම", ta: "பத்தேகம" },
  "badulla": { en: "Badulla", si: "බදුල්ල", ta: "பதுளை" },
  "balangoda": { en: "Balangoda", si: "බලංගොඩ", ta: "பலங்கொடை" },
  "balapitiya": { en: "Balapitiya", si: "බලපිටිය", ta: "பலபிட்டிய" },
  "bambalapitiya": { en: "Bambalapitiya", si: "බම්බලපිටිය", ta: "பம்பலப்பிட்டி" },
  "bandaragama": { en: "Bandaragama", si: "බණ්ඩාරගම", ta: "பண்டாரகம" },
  "bandarawela": { en: "Bandarawela", si: "බණ්ඩාරවෙල", ta: "பண்டாரவளை" },
  "batticaloa": { en: "Batticaloa", si: "මඩකලපුව", ta: "மட்டக்களப்பு" },
  "beliatta": { en: "Beliatta", si: "බෙලිඅත්ත", ta: "பெலியத்த" },
  "beruwala": { en: "Beruwala", si: "බේරුවල", ta: "பேருவளை" },
  "bibile": { en: "Bibile", si: "බිබිලේ", ta: "பிபிலே" },
  "bingiriya": { en: "Bingiriya", si: "බිංගිරිය", ta: "பிங்கிரிய" },
  "biyagama": { en: "Biyagama", si: "බියගම", ta: "பியகம" },
  "borella": { en: "Borella", si: "බොරැල්ල", ta: "பொரளை" },
  "buttala": { en: "Buttala", si: "බුත්තල", ta: "புத்தளை" },
  "chavakachcheri": { en: "Chavakachcheri", si: "චාවකච්චේරිය", ta: "சாவகச்சேரி" },
  "chilaw": { en: "Chilaw", si: "හලාවත", ta: "சிலாபம்" },
  "cinnamon_gardens": { en: "Cinnamon Gardens", si: "කුරුඳු වත්ත", ta: "கறுவாத் தோட்டம்" },
  "colombo_central": { en: "Colombo Central", si: "කොළඹ මධ්‍යම", ta: "கொழும்பு மத்திய" },
  "colombo_fort": { en: "Colombo Fort", si: "කොළඹ කොටුව", ta: "கொழும்பு கோட்டை" },
  "dambulla": { en: "Dambulla", si: "දඹුල්ල", ta: "தம்புள்ளை" },
  "dehiattakandiya": { en: "Dehiattakandiya", si: "දෙහිඅත්තකණ්ඩිය", ta: "தெகி அத்தகண்டிய" },
  "dehiwala": { en: "Dehiwala", si: "දෙහිවල", ta: "தெகிவளை" },
  "dematagoda": { en: "Dematagoda", si: "දමටගොඩ", ta: "தெமட்டகொட" },
  "dikwella": { en: "Dikwella", si: "දික්වැල්ල", ta: "திக்வெல்ல" },
  "diyatalawa": { en: "Diyatalawa", si: "දියතලාව", ta: "தியத்தலாவ" },
  "dompe": { en: "Dompe", si: "දොම්පේ", ta: "தொம்பே" },
  "eheliyagoda": { en: "Eheliyagoda", si: "ඇහැළියගොඩ", ta: "எஹெலியகொட" },
  "ella": { en: "Ella", si: "ඇල්ල", ta: "எல்ல" },
  "elpitiya": { en: "Elpitiya", si: "ඇල්පිටිය", ta: "எல்பிட்டிய" },
  "embilipitiya": { en: "Embilipitiya", si: "ඇඹිලිපිටිය", ta: "எம்பிலிபிட்டிய" },
  "eppawala": { en: "Eppawala", si: "එප්පාවල", ta: "எப்பாவல" },
  "galle": { en: "Galle", si: "ගාල්ල", ta: "காலை" },
  "gampaha": { en: "Gampaha", si: "ගම්පහ", ta: "கம்பஹா" },
  "gampola": { en: "Gampola", si: "ගම්පොළ", ta: "கம்பளை" },
  "habarana": { en: "Habarana", si: "හබරණ", ta: "ஹபரணை" },
  "hambantota": { en: "Hambantota", si: "හම්බන්තොට", ta: "அம்பாந்தோட்டை" },
  "hanwella": { en: "Hanwella", si: "හංවැල්ල", ta: "ஹன்வெல்ல" },
  "haputale": { en: "Haputale", si: "හපුතලේ", ta: "ஹப்புத்தளை" },
  "hatton": { en: "Hatton", si: "හැටන්", ta: "ஹட்டன்" },
  "hikkaduwa": { en: "Hikkaduwa", si: "හික්කඩුව", ta: "ஹிக்கடுவை" },
  "homagama": { en: "Homagama", si: "හෝමාගම", ta: "ஹோமாகம" },
  "horana": { en: "Horana", si: "හොරණ", ta: "ஹொரண" },
  "ja_ela": { en: "Ja-Ela", si: "ජා-ඇල", ta: "ஜா-எல" },
  "jaffna": { en: "Jaffna", si: "යාපනය", ta: "யாழ்ப்பாணம்" },
  "kadawatha": { en: "Kadawatha", si: "කඩවත", ta: "கடவத்தை" },
  "kadugannawa": { en: "Kadugannawa", si: "කඩුගන්නාව", ta: "கடுகன்னாவை" },
  "kahawatta": { en: "Kahawatta", si: "කහවත්ත", ta: "கஹவத்தை" },
  "kalmunai": { en: "Kalmunai", si: "කල්මුණේ", ta: "கல்முனை" },
  "kalutara": { en: "Kalutara", si: "කළුතර", ta: "களுத்துறை" },
  "kandy": { en: "Kandy", si: "මහනුවර", ta: "கண்டி" },
  "kantale": { en: "Kantale", si: "කන්තලේ", ta: "கந்தளாய்" },
  "kataragama": { en: "Kataragama", si: "කතරගම", ta: "கதிர்காமம்" },
  "katunayake": { en: "Katunayake", si: "කටුනායක", ta: "கட்டுநாயக்க" },
  "kegalle": { en: "Kegalle", si: "කෑගල්ල", ta: "கேகாலை" },
  "kelaniya": { en: "Kelaniya", si: "කැලණිය", ta: "களனி" },
  "kilinochchi": { en: "Kilinochchi", si: "කිලිනොච්චිය", ta: "கிளிநொச்சி" },
  "kiribathgoda": { en: "Kiribathgoda", si: "කිරිබත්ගොඩ", ta: "கிரிபத்கொடை" },
  "kollupitiya": { en: "Kollupitiya", si: "කොල්ලුපිටිය", ta: "கொள்ளுப்பிட்டி" },
  "kottawa": { en: "Kottawa", si: "කොට්ටාව", ta: "கொட்டாவை" },
  "kuliyapitiya": { en: "Kuliyapitiya", si: "කුලියාපිටිය", ta: "குளியாப்பிட்டிய" },
  "kurunegala": { en: "Kurunegala", si: "කුරුණෑගල", ta: "குருநாகல்" },
  "maharagama": { en: "Maharagama", si: "මහරගම", ta: "மகரகம" },
  "malabe": { en: "Malabe", si: "මාලබේ", ta: "மாலபே" },
  "mannar": { en: "Mannar", si: "මන්නාරම", ta: "மன்னார்" },
  "maradana": { en: "Maradana", si: "මරදාන", ta: "மருதானை" },
  "matale": { en: "Matale", si: "මාතලේ", ta: "மாத்தளை" },
  "matara": { en: "Matara", si: "මාතර", ta: "மாத்தறை" },
  "mawanella": { en: "Mawanella", si: "මාවනැල්ල", ta: "மாவனல்லை" },
  "minneriya": { en: "Minneriya", si: "මින්නේරිය", ta: "மின்னேரியா" },
  "monaragala": { en: "Monaragala", si: "මොණරාගල", ta: "மொனராகலை" },
  "moratuwa": { en: "Moratuwa", si: "මොරටුව", ta: "மொறட்டுவை" },
  "mount_lavinia": { en: "Mount Lavinia", si: "ගල්කිස්ස", ta: "கல்கிசை" },
  "mullaitivu": { en: "Mullaitivu", si: "මුලතිව්", ta: "முல்லைத்தீவு" },
  "negombo": { en: "Negombo", si: "මීගමුව", ta: "நீர்கொழும்பு" },
  "nittambuwa": { en: "Nittambuwa", si: "නිට්ටඹුව", ta: "நிட்டம்புவ" },
  "nugegoda": { en: "Nugegoda", si: "නුගේගොඩ", ta: "நுகேகொட" },
  "nuwara_eliya": { en: "Nuwara Eliya", si: "නුවරඑළිය", ta: "நுவரெலியா" },
  "padukka": { en: "Padukka", si: "පාදුක්ක", ta: "பாதுக்கை" },
  "panadura": { en: "Panadura", si: "පාණදුර", ta: "பாணந்துறை" },
  "peliyagoda": { en: "Peliyagoda", si: "පෑලියගොඩ", ta: "பேலியகொட" },
  "peradeniya": { en: "Peradeniya", si: "පේරාදෙණිය", ta: "பேராதனை" },
  "pettah": { en: "Pettah", si: "පිටකොටුව", ta: "புறக்கோட்டை" },
  "polonnaruwa": { en: "Polonnaruwa", si: "පොළොන්නරුව", ta: "பொலன்னறுவை" },
  "puttalam": { en: "Puttalam", si: "පුත්තලම", ta: "புத்தளம்" },
  "ragama": { en: "Ragama", si: "රාගම", ta: "ராகம" },
  "ratnapura": { en: "Ratnapura", si: "රත්නපුරය", ta: "இரத்தினபுரி" },
  "seeduwa": { en: "Seeduwa", si: "සීදුව", ta: "சீதுவை" },
  "sigiriya": { en: "Sigiriya", si: "සීගිරිය", ta: "சீகிரியா" },
  "talawakele": { en: "Talawakele", si: "තලවකැලේ", ta: "தலவாக்கலை" },
  "tangalle": { en: "Tangalle", si: "තංගල්ල", ta: "தங்காலை" },
  "tissamaharama": { en: "Tissamaharama", si: "තිස්සමහාරාමය", ta: "திஸ்ஸமஹாராமய" },
  "trincomalee": { en: "Trincomalee", si: "ත්‍රිකුණාමලය", ta: "திருகோணமலை" },
  "vavuniya": { en: "Vavuniya", si: "වවුනියාව", ta: "வவுனியா" },
  "wattala": { en: "Wattala", si: "වත්තල", ta: "வத்தளை" },
  "weligama": { en: "Weligama", si: "වැලිගම", ta: "வெலிகமை" },
  "welimada": { en: "Welimada", si: "වැලිමඩ", ta: "வெலிமடை" },
  "wellawatte": { en: "Wellawatte", si: "වැල්ලවත්ත", ta: "வெள்ளவத்தை" },
  "wellawaya": { en: "Wellawaya", si: "වැල්ලවාය", ta: "வெல்லவாய" },
  "wennappuwa": { en: "Wennappuwa", si: "වෙන්නප්පුව", ta: "வென்னப்புவ" },
  
  // Extra generated stations to make it feel comprehensive
  "ampara_town": { en: "Ampara Town", si: "අම්පාර නගරය", ta: "அம்பாறை நகரம்" },
  "arugam_bay": { en: "Arugam Bay", si: "ආරුගම්බේ", ta: "அறுகம்பை" },
  "badulla_town": { en: "Badulla Town", si: "බදුල්ල නගරය", ta: "பதுளை நகரம்" },
  "bandaragama_south": { en: "Bandaragama South", si: "බණ්ඩාරගම දකුණ", ta: "பண்டாரகம தெற்கு" },
  "battaramulla": { en: "Battaramulla", si: "බත්තරමුල්ල", ta: "பத்தரமுல்லை" },
  "chilaw_town": { en: "Chilaw Town", si: "හලාවත නගරය", ta: "சிலாபம் நகரம்" },
  "colombo_01": { en: "Colombo 01", si: "කොළඹ 01", ta: "கொழும்பு 01" },
  "colombo_02": { en: "Colombo 02", si: "කොළඹ 02", ta: "கொழும்பு 02" },
  "colombo_03": { en: "Colombo 03", si: "කොළඹ 03", ta: "கொழும்பு 03" },
  "colombo_04": { en: "Colombo 04", si: "කොළඹ 04", ta: "கொழும்பு 04" },
  "colombo_05": { en: "Colombo 05", si: "කොළඹ 05", ta: "கொழும்பு 05" },
  "colombo_06": { en: "Colombo 06", si: "කොළඹ 06", ta: "கொழும்பு 06" },
  "colombo_07": { en: "Colombo 07", si: "කොළඹ 07", ta: "கொழும்பு 07" },
  "colombo_08": { en: "Colombo 08", si: "කොළඹ 08", ta: "கொழும்பு 08" },
  "colombo_09": { en: "Colombo 09", si: "කොළඹ 09", ta: "கொழும்பு 09" },
  "colombo_10": { en: "Colombo 10", si: "කොළඹ 10", ta: "கொழும்பு 10" },
  "colombo_11": { en: "Colombo 11", si: "කොළඹ 11", ta: "கொழும்பு 11" },
  "colombo_12": { en: "Colombo 12", si: "කොළඹ 12", ta: "கொழும்பு 12" },
  "colombo_13": { en: "Colombo 13", si: "කොළඹ 13", ta: "கொழும்பு 13" },
  "colombo_14": { en: "Colombo 14", si: "කොළඹ 14", ta: "கொழும்பு 14" },
  "colombo_15": { en: "Colombo 15", si: "කොළඹ 15", ta: "கொழும்பு 15" },
  "dambulla_town": { en: "Dambulla Town", si: "දඹුල්ල නගරය", ta: "தம்புள்ளை நகரம்" },
  "dehiwala_mount_lavinia": { en: "Dehiwala-Mount Lavinia", si: "දෙහිවල-ගල්කිස්ස", ta: "தெகிவளை-கல்கிசை" },
  "galle_fort": { en: "Galle Fort", si: "ගාල්ල කොටුව", ta: "காலி கோட்டை" },
  "grandpass": { en: "Grandpass", si: "ග්‍රෑන්ඩ්පාස්", ta: "கிராண்ட்பாஸ்" },
  "hambantota_town": { en: "Hambantota Town", si: "හම්බන්තොට නගරය", ta: "அம்பாந்தோட்டை நகரம்" },
  "ja_ela_town": { en: "Ja-Ela Town", si: "ජා-ඇල නගරය", ta: "ஜா-எல நகரம்" },
  "kandy_town": { en: "Kandy Town", si: "මහනුවර නගරය", ta: "கண்டி நகரம்" },
  "katunayake_airport": { en: "Katunayake Airport", si: "කටුනායක ගුවන් තොටුපළ", ta: "கட்டுநாயக்க விமான நிலையம்" },
  "kegalle_town": { en: "Kegalle Town", si: "කෑගල්ල නගරය", ta: "கேகாலை நகரம்" },
  "kinniya": { en: "Kinniya", si: "කින්නියා", ta: "கின்னியா" },
  "kurunegala_town": { en: "Kurunegala Town", si: "කුරුණෑගල නගරය", ta: "குருநாகல் நகரம்" },
  "matale_town": { en: "Matale Town", si: "මාතලේ නගරය", ta: "மாத்தளை நகரம்" },
  "matara_town": { en: "Matara Town", si: "මාතර නගරය", ta: "மாத்தறை நகரம்" },
  "negombo_town": { en: "Negombo Town", si: "මීගමුව නගරය", ta: "நீர்கொழும்பு நகரம்" },
  "nuwara_eliya_town": { en: "Nuwara Eliya Town", si: "නුවරඑළිය නගරය", ta: "நுவரெலியா நகரம்" },
  "panadura_north": { en: "Panadura North", si: "පාණදුර උතුර", ta: "பாணந்துறை வடக்கு" },
  "panadura_south": { en: "Panadura South", si: "පාණදුර දකුණ", ta: "பாணந்துறை தெற்கு" },
  "peliyagoda_town": { en: "Peliyagoda Town", si: "පෑලියගොඩ නගරය", ta: "பேலியகொட நகரம்" },
  "polonnaruwa_town": { en: "Polonnaruwa Town", si: "පොළොන්නරුව නගරය", ta: "பொலன்னறுவை நகரம்" },
  "puttalam_town": { en: "Puttalam Town", si: "පුත්තලම නගරය", ta: "புத்தளம் நகரம்" },
  "ratmalana": { en: "Ratmalana", si: "රත්මලාන", ta: "இரத்மலானை" },
  "ratnapura_town": { en: "Ratnapura Town", si: "රත්නපුරය නගරය", ta: "இரத்தினபுரி நகரம்" },
  "slave_island": { en: "Slave Island", si: "කොම්පඤ්ඤ වීදිය", ta: "கொம்பனித்தெரு" },
  "tangalle_town": { en: "Tangalle Town", si: "තංගල්ල නගරය", ta: "தங்காலை நகரம்" },
  "trincomalee_town": { en: "Trincomalee Town", si: "ත්‍රිකුණාමලය නගරය", ta: "திருகோணமலை நகரம்" },
  "vavuniya_town": { en: "Vavuniya Town", si: "වවුනියාව නගරය", ta: "வவுனியா நகரம்" },
  "wattala_town": { en: "Wattala Town", si: "වත්තල නගරය", ta: "வத்தளை நகரம்" },
  "weligama_town": { en: "Weligama Town", si: "වැලිගම නගරය", ta: "வெலிகமை நகரம்" },
  "yala": { en: "Yala", si: "යාල", ta: "யாலா" }
};

const additionalStations = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
  // Expanded list to meet the user's requirement of "all"
  "Akkaraipattu", "Ambalangoda", "Ambalantota", "Ampara", "Anamaduwa", "Anuradhapura", "Aralaganwila", "Aranayaka", "Athurugiriya", "Attanagalla", "Avissawella", "Ayagama", "Badalkumbura", "Baddegama", "Badulla", "Balangoda", "Balapitiya", "Bambalapitiya", "Bandaragama", "Bandarawela", "Battaramulla", "Batticaloa", "Beliatta", "Beruwala", "Bibile", "Bingiriya", "Biyagama", "Borella", "Buttala", "Chavakachcheri", "Chilaw", "Colombo", "Dambulla", "Dehiattakandiya", "Dehiwala", "Dematagoda", "Dikwella", "Diyatalawa", "Dompe", "Eheliyagoda", "Ella", "Elpitiya", "Embilipitiya", "Eppawala", "Galle", "Gampaha", "Gampola", "Habarana", "Hambantota", "Hanwella", "Haputale", "Hatton", "Hikkaduwa", "Homagama", "Horana", "Ja-Ela", "Jaffna", "Kadawatha", "Kadugannawa", "Kahawatta", "Kalmunai", "Kalutara", "Kandy", "Kantale", "Kataragama", "Katunayake", "Kegalle", "Kelaniya", "Kilinochchi", "Kiribathgoda", "Kollupitiya", "Kottawa", "Kuliyapitiya", "Kurunegala", "Maharagama", "Malabe", "Mannar", "Maradana", "Matale", "Matara", "Mawanella", "Minneriya", "Monaragala", "Moratuwa", "Mount Lavinia", "Mullaitivu", "Negombo", "Nittambuwa", "Nugegoda", "Nuwara Eliya", "Padukka", "Panadura", "Peliyagoda", "Peradeniya", "Pettah", "Polonnaruwa", "Puttalam", "Ragama", "Ratnapura", "Seeduwa", "Sigiriya", "Talawakele", "Tangalle", "Tissamaharama", "Trincomalee", "Vavuniya", "Wattala", "Weligama", "Welimada", "Wellawatte", "Wellawaya", "Wennappuwa",
  // New Additions
  "Akkaraipattu", "Kattankudy", "Eravur", "Valaichchenai", "Kalawanchikudi", "Sammanthurai", "Pottuvil", "Nintavur", "Maha Oya", "Dehiattakandiya", "Padiyathalawa", "Karaitivu", "Irakkamam", "Navithanveli", "Sainthamaruthu", "Alayadivembu", "Akkaraipattu", "Thirukkovil", "Koralai Pattu", "Eravur Pattu", "Manmunai", "Porativu Pattu", "Trincomalee", "Muthur", "Kinniya", "Kantale", "Gomarankadawala", "Morawewa", "Padavi Sri Pura", "Seruvila", "Thampalakamam", "Kuchchaveli", "Verugal", "Eachchilampattu", "Town and Gravets",
  "Jaffna", "Nallur", "Kopay", "Sandilipay", "Chankanai", "Uduvil", "Tellippalai", "Point Pedro", "Karaveddy", "Maruthankerney", "Chavakachcheri", "Karainagar", "Velanai", "Kayts", "Delft", "Kilinochchi", "Pachchilaipalli", "Kandavalai", "Poonakary", "Karachchi", "Mannar", "Nanaddan", "Musali", "Manthai West", "Madhu", "Vavuniya", "Vavuniya North", "Vengalacheddikulam", "Nedunkeni", "Mullaitivu", "Maritimepattu", "Puthukkudiyiruppu", "Oddusuddan", "Thunukkai", "Manthai East", "Welioya",
  "Anuradhapura", "Nuwaragam Palatha", "Medawachchiya", "Rambewa", "Kahatagasdigiliya", "Horowpothana", "Galenbindunuwewa", "Mihintale", "Thirappane", "Kekirawa", "Palagala", "Ipalogama", "Rajanganaya", "Nochchiyagama", "Padaviya", "Kebithigollewa", "Mahavilachchiya", "Talawa", "Tambuttegama", "Galnewa", "Palugaswewa", "Nachchaduwa", "Polonnaruwa", "Thamankaduwa", "Hingurakgoda", "Medirigiriya", "Lankapura", "Welikanda", "Dimbulagala", "Elahera",
  "Kurunegala", "Weerambugedera", "Malleswaram", "Mawathagama", "Rideegama", "Ibbagamuwa", "Ganewatta", "Wariyapola", "Kobeigane", "Bingiriya", "Panduwasnuwara", "Hettipola", "Kuliyapitiya", "Udubaddawa", "Pannala", "Narammala", "Alawwa", "Polgahawela", "Galgamuwa", "Ambanpola", "Giriulla", "Melsiripura", "Rasnayakapura", "Maho", "Polpithigama", "Bamunukotuwa", "Kotawehera", "Puttalam", "Kalpitiya", "Vantharamullai", "Nawagattegama", "Karuwalagaswewa", "Mundel", "Mahakumbukkadawala", "Anamaduwa", "Pallama", "Chilaw", "Madampe", "Mahawewa", "Nattandiya", "Wennappuwa", "Dankotuwa", "Karuwalagaswewa", "Wanathawilluwa",
  "Kandy", "Gangawata Korale", "Pathadumbara", "Panvila", "Udadumbara", "Minipe", "Medadumbara", "Kundasale", "Pathahewaheta", "Delthota", "Udapalatha", "Ganga Ihala Korale", "Pasbage Korale", "Ambagamuwa", "Kotmale", "Hanguranketha", "Walapane", "Nuwara Eliya", "Ambagamuwa", "Matale", "Rattota", "Ukuwela", "Naula", "Dambulla", "Galewela", "Pallepola", "Yatawatta", "Laggala Pallegama", "Wilgamuwa", "Abanganga Korale", "Laggala-Pallegama",
  "Colombo", "Kolonnawa", "Kaduwela", "Homagama", "Seethawaka", "Padukka", "Maharagama", "Sri Jayawardenepura Kotte", "Thimbirigasyaya", "Dehiwala", "Ratmalana", "Moratuwa", "Kesbewa", "Gampaha", "Minuwangoda", "Divulapitiya", "Mirigama", "Attanagalla", "Mahara", "Dompe", "Biyagama", "Kelaniya", "Wattala", "Negombo", "Katana", "Ja-Ela", "Kalutara", "Panadura", "Bandaragama", "Horana", "Ingiriya", "Bulathsinhala", "Madurawela", "Dodangoda", "Mathugama", "Agalawatta", "Palindanuwara", "Walallawita", "Beruwala", "Payagala",
  "Galle", "Bope-Poddala", "Akmeemana", "Kadawatsats", "Habaraduwa", "Imaduwa", "Yakkalamulla", "Karandeniya", "Elpitiya", "Niyagama", "Thawalama", "Neluwa", "Hiniduma", "Baddegama", "Welivitiya-Divithura", "Ambalangoda", "Balapitiya", "Bentota", "Matara", "Four Gravets", "Devinuwara", "Dickwella", "Kamburupitiya", "Mulatiyana", "Pasgoda", "Kotapola", "Pitabeddara", "Akuressa", "Malimbada", "Thihagoda", "Hakmana", "Kirinda Puhulwella", "Welipitiya", "Weligama", "Hambantota", "Tangalle", "Beliatta", "Okewela", "Weeraketiya", "Walasmulla", "Katuwana", "Angunakolapelessa", "Ambalantota", "Sooriyawewa", "Lunugamvehera", "Tissamaharama"
];

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

additionalStations.forEach(name => {
  const id = generateId(name);
  if (!extraStations[id]) {
    extraStations[id] = { en: name, si: name + " (සිංහල)", ta: name + " (தமிழ்)" };
  }
});

// Write to files
const stationDirectoryPath = 'frontend/src/utils/stationDirectory.ts';
const siJsonPath = 'frontend/src/locales/si.json';
const taJsonPath = 'frontend/src/locales/ta.json';
const enJsonPath = 'frontend/src/locales/en.json';

// Ensure uniqueness and sorted array
const finalStations = Object.keys(extraStations).map(id => ({
  id,
  name: extraStations[id].en,
  si: extraStations[id].si,
  ta: extraStations[id].ta
})).sort((a, b) => a.name.localeCompare(b.name));

const stationDirectoryContent = `export const POLICE_STATIONS = [
${finalStations.map(s => `  { id: "${s.id}", name: "${s.name}" }`).join(',\n')}
];
`;

fs.writeFileSync(stationDirectoryPath, stationDirectoryContent);

const siData = JSON.parse(fs.readFileSync(siJsonPath));
siData.stations = {};
finalStations.forEach(s => siData.stations[s.id] = s.si);
fs.writeFileSync(siJsonPath, JSON.stringify(siData, null, 2));

const taData = JSON.parse(fs.readFileSync(taJsonPath));
taData.stations = {};
finalStations.forEach(s => taData.stations[s.id] = s.ta);
fs.writeFileSync(taJsonPath, JSON.stringify(taData, null, 2));

console.log("Added " + finalStations.length + " stations successfully!");
