const mongoose = require('mongoose')
const {Schema } = mongoose
const {Types } = Schema 
const { ObjectId} = Types
const MessageSchema =  new mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'Users',
        required: true

    },
    to: {
        type: ObjectId,
        ref: 'Users',
        required: true,
        
    },
    message: {
        type: String,
        required: true,
        trim: true,
    } 
},{
    _id: true,
    timestamps: true,
    collection: "messages",
    toJson: {
        transform(doc,ret){
            delete ret.__v
            return ret 
        }
    }
})



module.exports = mongoose.model('Message', MessageSchema)