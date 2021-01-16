const express = require('express');
const axios = require('axios').default;

const app = express();

const PORT = process.env.PORT || '8050';

app.get('/api/rates', async (req, res) => {
    const { query } = req;

    let currencies = [];

    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    try {
        const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${query.base}`);

        let rates = {};

        if (query.currency) {
            currencies = query.currency.split(',');

            currencies.forEach(currency => {
                rates[currency] = response.data.rates[currency]
            });
        } else {
            rates = response.data.rates;
        }

        res.status(200).json({
            results: {
                base: query.base,
                date: formattedDate,
                rates,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
})

app.use('*', (req, res) => {
    res.status(200).json({
        "message": "Welcome to my Enye Backend :-D"
    })
})

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
