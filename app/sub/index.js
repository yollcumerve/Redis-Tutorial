const client = require('../../redis/index')


const Subscriber = async () => {
    const channel = "message"
    await client.connect()
    await client.subscribe(channel, (messageStr) => {
        const message = JSON.stringify(messageStr)
        console.log(message)
        console.log('Sender:',message.from)
        console.log('Receiver:',message.to )
        console.log('Message:',message.message )
        console.log("-------------------------")
    })
}


Subscriber().then(() => {
    console.log("Subscribe STARTED");
}).catch((err) => {
    console.log(err)
})  