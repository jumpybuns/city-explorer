const client = require('../lib/client');
// import our seed data:
const geos = require('./geos.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      geos.map(location => {
        return client.query(`
                    INSERT INTO geos (display_name, lat, lon, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [location.display_name, location.lat, location.lon,  user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
