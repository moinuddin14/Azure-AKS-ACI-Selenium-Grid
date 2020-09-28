const fs = require('fs');
const YAML = require('js-yaml');
let sh = require('shelljs');
const chromeFileName = 'chrome-node-AKS-deployment.yaml';
const firefoxFileName = 'firefox-node-AKS-deployment.yaml';
let raw;
let data;
let yaml;

console.log(
  '############### Creating Environment Variable for Selenium HUB ###############'
);

const HUB_URL = process.env.HUB_URL;
console.log(`Hub Url : ${HUB_URL}`);

console.log(
  '############### START OF UPDATING THE CHROME DEPLOYMENT YAML FILE WITH HUB IP ###############'
);

// Load the YAML File
raw = fs.readFileSync(chromeFileName);
data = YAML.safeLoad(raw);

// Print to console the value that needs to be updated
console.log(data.spec.template.spec.containers[0].env[0].value);

// Update the YAML file with the HUB url
data.spec.template.spec.containers[0].env[0].value = `${HUB_URL}`;

// Save the YAML file with the updated data
yaml = YAML.safeDump(data);
fs.writeFileSync(chromeFileName, yaml, function (err, file) {
  if (err) throw err;
  console.log('File is saved with HUB Value');
});

console.log(
  '############### END OF UPDATING THE CHROME DEPLOYMENT YAML FILE WITH HUB IP ###############'
);

console.log(
  '############### START OF UPDATING THE FIREFOX DEPLOYMENT YAML FILE WITH HUB IP ###############'
);

// Load the YAML File
raw = fs.readFileSync(firefoxFileName);
data = YAML.safeLoad(raw);

// Print to console the value that needs to be updated
console.log(data.spec.template.spec.containers[0].env[0].value);

// Update the YAML file with the HUB url
data.spec.template.spec.containers[0].env[0].value = `${HUB_URL}`;

// Save the YAML file with the updated data
yaml = YAML.safeDump(data);
fs.writeFileSync(firefoxFileName, yaml, function (err, file) {
  if (err) throw err;
  console.log('File is saved with HUB Value');
});

console.log(
  '############### END OF UPDATING THE FIREFOX DEPLOYMENT YAML FILE WITH HUB IP ###############'
);
