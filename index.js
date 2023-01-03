const app = require("express")();
const helmet = require("helmet");
require("express-async-errors");
const { json, urlencoded } = require("express");
const router = require("express").Router();
const RouterFns = require("./routes/index");
const mongoose = require("mongoose");
const Models = require("./mongodb /index");
const client = require("./redis/index");
const ExampleDataFormation = require("./mongodb /data/index");
const RedisUsersCacheWorker = require("./workers/UsersRedisCacheWorker")
const cron  = require('node-cron')
let redisConnected = false, mongoDBConnected = false



RouterFns.forEach((routerFn, index) => {
  routerFn(router);
});

app.use(helmet());

app.use(json());
app.use(urlencoded({ limit: "1mb", extended: true }));

app.use("/api", router);

client.on("connect", () => {
  console.log("REDIS CLIENT CONNECTED");
});
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});


client
  .connect()
  .then(() => {
    console.log("SONUNDA BAĞLAN BE REDİS ")
    redisConnected = true
  })
  .catch((err) => {
    console.log(err);
  }); 

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://redis:E7Xpaqs1B5U6rVMD@redis.jvnuvzx.mongodb.net/test"
  )
  .then(async () => {
    console.log("mongoDB connected")
    mongoDBConnected = true
  })
  // await ExampleDataFormation()
  .catch((err) => {
    console.log(err);
  });

  // cron.schedule('* * * * *', () => {
  //   console.log('Redis Connceted', redisConnected);
  //   console.log('MongoDB Connceted', mongoDBConnected);
  //   if(redisConnected && mongoDBConnected){
  //     RedisUsersCacheWorker().then((res) => {
  //       if(res){
  //         console.log("users are synchronized with redis cache system")
  //       }
  //     }).catch((err) => {
  //       console.log(err)
  //     })
  //   }else{
  //     console.log(('you cant run the worker because of connection not established'));
  //   }
   
  // })

app.listen(8080, () => {
  console.log("PORT:8080");
})
