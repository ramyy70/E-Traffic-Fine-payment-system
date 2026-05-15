const https = require('https');

const query = `
SELECT ?item ?itemLabel ?itemLabelSi ?itemLabelTa WHERE {
  ?item wdt:P31/wdt:P279* wd:Q874052.
  ?item wdt:P17 wd:Q854.
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "en") }
  OPTIONAL { ?item rdfs:label ?itemLabelSi. FILTER(LANG(?itemLabelSi) = "si") }
  OPTIONAL { ?item rdfs:label ?itemLabelTa. FILTER(LANG(?itemLabelTa) = "ta") }
}
`;

const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query) + '&format=json';

const options = {
  headers: {
    'User-Agent': 'Nodejs/1.0 (antigravity)'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed.results.bindings.slice(0, 10), null, 2));
      console.log(`Total results: ${parsed.results.bindings.length}`);
    } catch(e) {
      console.error(e);
      console.log(data);
    }
  });
}).on('error', console.error);
