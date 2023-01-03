/* 
Bu worker içine mongoose'dan veriler alınacak ve redis e tüm verileir yazcaağız, daha sonra bunu redis insight içerisinde yazılıp yazılmadığını
kontrol edeceğiz
*/

const mongoose = require('mongoose')
const Users = require('../mongodb /user')
const client = require('../redis/index')

// veri tabanının üzeirne fazla yük binmemesi için bekleyici bir fonksiyon tanımlıyoruz 
const stopForMs = (ms) => {
    return new Promise((resolve,reject) => {
        setTimeout(function(){
            resolve()
        },ms)  // belirli bir ms için bütün kodu bekletmiş oluyor 
    })
}


 // verileri batch ile 2 şer 2şer yazmasını sağlar redis veri tabanına 
const RedisUsersCacheWorker = async(page= 0, batch = 2)=> {
    const users = await Users.find({}).skip(page*batch).limit(batch).lean()
    if(users.length === 0){
        return true // ve arkadak işlemleri devam etmiyor oldu
    }
    console.log("Page:",page+1, "Batch of ", batch,"is adding to the cache")

                    // users/1/2 yani birinci sayfada 2 veri var 
    await client.set(`users/${page+1}/${batch}`, JSON.stringify(users),{
        EX: 60,
        NX: false,
        KEEPTTL: true
    }) 
    await stopForMs(1000) // verileir art arda çekecek ama yük oluşmaması için araya 1 sn dinlenme olayı koyduk
     return await RedisUsersCacheWorker(page+1, batch)

}

module.exports = RedisUsersCacheWorker // invoke edilmemiş şekild eolacak ki ben mongodb bağlantısı olan yerde invoke edebileyim