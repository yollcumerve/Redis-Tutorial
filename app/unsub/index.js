const client = require('../../redis/index')


const SubscribeAndUnsub = async () => {
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
    let i = 0
    const wait = 30
    console.log("Subscribe STARTED will be done in 30 sec");

    const timer = setInterval(() => {
        i++
        console.log(wait - i, "seconds left")
    },1000)

    const waited = await new Promise((resolve, rejected) => {
        setTimeout(() => {
            clearInterval(timer)
            resolve(true)
        }, wait*1000)
    })
    if(waited === true){
        await client.unsubscribe(channel)
        console.log("stopped")
    }
}


SubscribeAndUnsub().then(() => {
    console.log("Subscribe STARTED will be done in 30 sec");
}).catch((err) => {
    console.log(err)
})  