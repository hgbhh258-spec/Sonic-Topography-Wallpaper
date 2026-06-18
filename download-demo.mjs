import fs from 'fs';
import https from 'https';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const file = fs.createWriteStream('public/demo.mp3');
const url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, options, (redirectRes) => {
      redirectRes.pipe(file);
      file.on('finish', () => file.close());
    });
  } else {
    res.pipe(file);
    file.on('finish', () => file.close());
  }
}).on('error', (err) => {
  console.error(err);
});
