const client = require('../../redis/index')

const Publisher = async () => {
    const channel = "message"
    const data = {
        from:"Startup Academy",
        to:"Merve Yolcu",
        message:"Test message Successful"
    }
    await client.connect()
    await client.publish(channel, JSON.stringify(data)) // data burada bir object ama publish ederken benim string göndermem gerektiğinden 
}

Publisher().then(() => {
    console.log("Message Published");
}).catch(err => {
    console.log(err);
})