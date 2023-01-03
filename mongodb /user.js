const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,

    },
    surname: {
        type: String,
        required: true,
        trim: true,
        
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        
    },
    photoUrl: {
        type: String,
        trim: true,
        default: null
    }
},{
    _id: true,
    timestamps: true,
    collection: "users",
    toJson: {
        transform(doc,ret){
            delete ret.password,
            delete ret.__v
            return ret 
        }
    }
})

UserSchema.pre('save', async function preSave(next){
   if(this.isNew){
    try {
        this.password = await bcrypt.hash(this.password,10)
    } catch (e) {
        return next(e)
    }
   }
   next()
})

module.exports = mongoose.model('Users', UserSchema)