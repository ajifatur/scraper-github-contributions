const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://github.com/ajifatur')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                let count = 0;
                let levels = [0,0,0,0,0];
                $('.js-calendar-graph-svg .ContributionCalendar-day').each(function(i, elem) {
                    data[i] = {
                        date: $(elem).data('date'),
                        count: $(elem).data('count'),
                        level: $(elem).data('level'),
                    };
                    count += $(elem).data('count');
                    levels[$(elem).data('level')]++;
                });
                data = data.filter(n => n !== undefined);
                res.json({
                    data: data,
                    count: count,
                    levels: levels
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});