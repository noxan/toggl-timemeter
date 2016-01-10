const csv = require('csv');
const fs = require('fs');
const moment = require('moment');

var email = 'richard.stromer@gmail.com';


function transform(row) {
  var startDatetime = moment(new Date(row['> Start Date']));
  var endDatetime = moment(new Date(row['> End Date']));
  var duration = endDatetime.diff(startDatetime);
  return {
    'Email': email,
    'Client': row['> Tag/Category'].split('/')[0],
    'Project': row['> Tag/Category'].split('/')[1],
    'Description': row['> Description'],
    'Start date': startDatetime.format('YYYY-MM-DD'),
    'Start time': startDatetime.format('HH:mm:ss'),
    'Duration': moment.utc(duration).format('HH:mm:ss'),
  };
}

function convertFile(filename) {
  fs.readFile(filename, 'utf8', function (err, data) {
    csv.parse(data, {
      columns: true,
    }, function (err, rows) {
      rows = rows.map(function (row) {
        return transform(row);
      });
      rows = rows.filter(function (row) {
        const valid = row.Email.length > 0 && row.Description.length > 0 && row['Start date'] !== 'Invalid date'
          && row['Start time'] !== 'Invalid date' && row['Duration'] !== 'Invalid date';
        if (!valid) {
          console.log('Row is invalid and was skipped:', row);
        }
        return valid;
      });
      csv.stringify(rows, {
        header: true,
      }, function (err, resultData) {
        fs.writeFile('result-' + filename, resultData);
      });
    });
  });
}


if (process.argv.length < 3) {
  throw new Error('Missing email parameter.');
}
if (process.argv.length < 4) {
  throw new Error('Missing filename parameter.');
}
email = process.argv[2];
if (email.length <= 0) {
  throw new Error('Missing email parameter.');
}
convertFile(process.argv[3]);
