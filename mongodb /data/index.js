const Users = require('../user')
const Messages = require('../message')

const UserData = require('./users.js')
const MessageData = require('./messages.js')

const ExampleDataFormation = async () => {
    // users  count 
    const usersCount = await Users.estimatedDocumentCount()

    if(usersCount <= 0){
        await Users.create(UserData)
    }

    const messagesCount = await Messages.estimatedDocumentCount()

    if(messagesCount <= 0){
        const user1 = await Users.findOne({})
        const user2 = await Users.findOne({}).skip(0)

        const messages = MessageData.map((data, index) => {
            if(index % 2 === 0){
                return {
                    from: user1?._id,
                    to: user2?._id,
                    ...data
                }
            }else{
                return {
                from: user2?._id,
                to: user1?._id,
                ...data
                }
            }
        })
        await Messages.create(messages)
    }
}

module.exports = ExampleDataFormation