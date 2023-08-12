const { Client } = require('pg')
const client = new Client({
    database: '_9a',
    port: 5432,
})
client.connect().then(() => {
    return client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`)
    })
    .then((res) => {
        console.log(res.rows.map(row => row.table_name)) // Hello world!
        client.end()
    })
 
