const { MongoClient } = require('../BackEndExample/node_modules/mongodb');
const fs = require('fs');
const path = require('path');
(async () => {
 require('../BackEndExample/node_modules/dotenv').config({path:path.join(__dirname,'../BackEndExample/.env')});
 const {DBUSER, DBPASSWORD, DBNAME, DBPORT, DBHOST, DBAUTHSOURCE} = process.env;
 if (!DBUSER || !DBPASSWORD || !DBNAME || !DBPORT) throw Error('請先設定 BackEndExample/.env');
 const authenticated = process.argv.includes('--auth');
 const uri = authenticated ? `mongodb://${encodeURIComponent(DBUSER)}:${encodeURIComponent(DBPASSWORD)}@${DBHOST || '127.0.0.1'}:${DBPORT}/${DBNAME}?authSource=${DBAUTHSOURCE || DBNAME}` : `mongodb://127.0.0.1:${DBPORT}`;
 const client = await MongoClient.connect(uri);
 try {
  const db = client.db(DBNAME);
  if (!authenticated) throw Error('請先按 README 建立資料庫帳號，再加 --auth 匯入');
  const lines = fs.readFileSync(path.join(__dirname,'../studentslist.csv'),'utf8').trim().split(/\r?\n/);
  const keys = lines.shift().replace(/^\uFEFF/,'').split(',');
  for (const line of lines) {
   const values = line.split(',');
   const student = Object.fromEntries(keys.map((key,i)=>[key,values[i]]));
   await db.collection('students').updateOne({userName:student.userName},{$setOnInsert:student},{upsert:true});
  }
  console.log('Student count:',await db.collection('students').countDocuments());
 } finally {await client.close();}
})().catch(e=>{console.error(e.message);process.exit(1)});
