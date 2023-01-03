const client = require('../redis/index')

const Users = require('../mongodb /user')
const Messages = require('../mongodb /message')

module.exports = function(router){
    router.get('/cached/users', async(req,res) => {
        const users = await Users.find({}).limit(2).lean()
        res.json({
            message: "not cached users",
            users: users
        })
    })

    //cached users 

    router.get('/cached/user-cached', async (req,res) => {
        const cacheKey = "users/first2"
        let users = await client.get(cacheKey)
        if(!users){
            users = await Users.find({}).limit(2).lean()
            await client.set(cacheKey, JSON.stringify(users))
        }else{
            users =JSON.parse(users)
        }
        res.json({
            message: "cached users ",
            users: users
        })
    })

    //Absolute Timing : verilen x süre sonra verinin silinmesi olayına denir

    router.get('/cached/users-cached-absolute-expire', async(req,res) => {
        const cacheKey = '/users/expire/first2'
        let users = await client.get(cacheKey)
        if(!users){
            users = await Users.find({}).limit(2).lean() // users boş geldiyse mongoDb den yazıyoruz 
            await client.set(cacheKey, JSON.stringify(users),{
                EX:60, // veri tabanından silinecek zamanı söyler. bknz 60 sn 
                NX:  true, // eğer key daha önceden set edilmişse true dendiğinde key tekrardan set edilmeyip pas geçilir 
                KEEPTTL: true
            }) // cach lemeye yarar 
        }else{
            users = JSON.parse(users)
        }
        res.json({
            message: "cached users with absolute timing",
            users: users
        })
    })

    //sliding times 
    router.get('/cached/users-cached-sliding-expire', async(req,res) => {
        const cacheKey = "users/expire/first2"
        let users = await client.get(cacheKey)

        if(!users){
            users = await Users.find({}).limit(2).lean()
            await client.set(cacheKey, JSON.stringify(users),{
                EX: 60,
                NX: true,
                KEEPTTL: true
            })
        }else{
            const GETEXOLD = await client.ttl(cacheKey) // ttl içine key alır, bu bana verimin ölmesi için ne kadar zamanın kaldığını söyler
            console.log("Cache would have been expired in", GETEXOLD,"seconds")

            client.expire(cacheKey, 60).then(async() => {
                const GETEXNEW = await client.ttl(cacheKey)
                console.log("Cache will have been expired in", GETEXNEW,"seconds")
            }).catch(err => {
                console.log(err)
            })
            users = JSON.parse(users)
        }
        res.json({
            message:"cached users sliding time  ",
            users : users
        })
    })

    // prepopulation: cache'lenecek vernin sistem başlatılmadan önce redis üzerinde cache lenmesi ve daha sonrasında cache li bir şekilde sistem züerinde çalışmasını ifade eder
    // on demand aksine tüm veriyi buraya taşımak gerekir, belirli zaman dilimleri olması gerekir
    // prepolulation yazmak için bir worker yazılmalı 
    //prepoulation ile ondeamnd arasında tek fark birisinde baştan yazılırken diğerinde çağrıldığı anda yazılmadı, prepoulation ile istek 
    //halinde response a basabiliyorum


    router.get('/cached/messages', async (req,res) => {
        const messages = await Messages.find({}).populate(["from", "to"]).limit(2).lean() // lean() ile sadece obje biçiminde nesenler gelecek olacak
        res.json({
            message: "NON-CACHED MESSAGES",
            messages: messages
        })
    })

    router.get('/cached/messages-cached', async(req,res) => {
        const cachekey = "messages/1"
        let messages = await client.json.get(cachekey)
        if(!messages){
            console.log("cache addding");
            messages = await Messages.find({}).populate(["from","to"]).limit(2).lean()
            await client.json.set(cachekey, '$', messages)
            
        }
        res.json({
            message:"CACHED MESSAGES",
            messages: messages
        })
    })

    
}