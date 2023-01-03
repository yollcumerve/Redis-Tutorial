const client = require('../../redis/index')

const ReadChannels = async () => {
    await client.connect()
    const channels = await client.pubSubChannels() // Hnagi kanalların ayakta olduğunu söyleyebiliyor 

    console.log("---------------")
    console.log(channels);
    process.exit(0)
}

ReadChannels().then(() => {
    console.log("CHANNELS STARTED")
}).catch(err => {
    console.log(err)
})