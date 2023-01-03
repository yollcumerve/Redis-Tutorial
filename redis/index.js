const redis = require('redis')


const url = "redis://default:7794m07uhApTDwDNXkb6GiNVENztHpeJ@redis-18068.c293.eu-central-1-1.ec2.cloud.redislabs.com:18068"

const client = redis.createClient({
    url: url 
})

module.exports = client