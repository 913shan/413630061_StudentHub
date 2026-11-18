const appDb = db.getSiblingDB('studenthub');
appDb.createUser({user:'studenthub_app',pwd:process.env.MONGO_APP_PASSWORD,roles:[{role:'readWrite',db:'studenthub'}]});
const lines = require('fs').readFileSync('/seed/studentslist.csv','utf8').trim().split(/\r?\n/);
const keys = lines.shift().replace(/^\uFEFF/,'').split(',');
appDb.students.insertMany(lines.map(line => {
 const values = line.split(',');
 return Object.fromEntries(keys.map((key,i) => [key,values[i]]));
}));
