const fs = require('fs');
const path = require('path');
const https = require('https');

const contentPath = path.join(__dirname, '../data/content.json');

async function fetchAppName(id) {
    return new Promise((resolve, reject) => {
        const url = `https://itunes.apple.com/lookup?id=${id}&country=JP`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.results && json.results.length > 0) {
                        resolve(json.results[0].trackName);
                    } else {
                        console.warn(`App not found for ID: ${id}`);
                        resolve(`Unknown App (${id})`);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function migrate() {
    try {
        const rawData = fs.readFileSync(contentPath, 'utf8');
        const data = JSON.parse(rawData);

        if (!data.iosAppIds) {
            console.log('No iosAppIds found, maybe already migrated?');
            return;
        }

        console.log(`Found ${data.iosAppIds.length} apps to migrate...`);
        const newApps = [];

        for (const id of data.iosAppIds) {
            console.log(`Fetching name for ID: ${id}...`);
            // Sleep slightly to avoid rate limits if many
            await new Promise(r => setTimeout(r, 200));
            try {
                const name = await fetchAppName(id);
                console.log(`  -> ${name}`);
                newApps.push({ id, name });
            } catch (e) {
                console.error(`Failed to fetch ${id}:`, e);
                newApps.push({ id, name: `Unknown App (${id})` });
            }
        }

        data.iosApps = newApps;
        delete data.iosAppIds;

        fs.writeFileSync(contentPath, JSON.stringify(data, null, 2));
        console.log('Migration complete! Updated data/content.json');

    } catch (e) {
        console.error('Migration failed:', e);
    }
}

migrate();
