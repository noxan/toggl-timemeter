const TogglClient = require('toggl-api');

const toggl = new TogglClient({
  apiToken: 'secret',
});


console.log(toggl);
