const client = require("../redis/index");

module.exports = (router) => {
  //test
  router.get("/redis/test", async (req, res) => {
    res.json({
      message: "Welcome to Redis Router",
    });
  });

  //string
  router.get("/redis/string", async (req, res) => {
    const KEY = "string";
    let value = await client.get(KEY);
    if (!value) {
      console.log("Veri yazılıyor");
      const val = "hello world";
      const write = await client.set(KEY, val);
      if (write === "OK") {
        value = val;
      }
    }
    res.json({
      message: "welcome to redis string",
      value: value,
    });
  });

  //hash
  router.get("/redis/hash", async (req, res) => {
    const KEY = "hash";
    let value = await client.hGetAll(KEY);
    if (Object.keys(value).length === 0) {
      console.log("Veri yaziliyor");
      await client.hSet(KEY, "name", "john doe");
      await client.hSet(KEY, "age", 30);
    }

    res.json({
      message: "welcome to redis hash",
      value: value,
    });
  });

  //list
  router.get("/redis/list", async (req, res) => {
    const KEY = "list";
    await client.lPush(KEY, ["Arda", "Sıla", "Kerem"]);
    const value = await client.lRange(KEY, 0, -1);

    res.json({
      message: "welcome redis list ",
      value: value,
    });
  });

  //set :  a unique array
  router.get("/redis/set", async (req, res) => {
    const KEY = "set";
    const value = await client.sMembers(KEY);

    if (value.length === 0) {
      console.log("vERİ YAZILIYOR...");
      await client.sAdd(KEY, [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "monday",
      ]);
    }
    res.json({
      message: "redis set",
      value: value,
    });
  });

  //zset ,sorted sets
  router.get("/redis/zset", async (req, res) => {
    const KEY = "zset";
    await client.zAdd(KEY, [
      {
        score: "4", // bu value a kaşrılık gelen score değeridir
        value: "Ahmet",
      },
      {
        score: "1",
        value: "Merve",
      },
      {
        score: "2",
        value: "Gizem",
      },
      {
        score: "3",
        value: "Can",
      },
    ]);

    const value = await client.zRange(KEY, 0, -1);

    res.json({
      message: "Hello zset",
      value: value,
    });
  });

  //json
  router.get("/redis/json", async (req, res) => {
    const KEY = "json";
    let value = await client.json.get(KEY);
    if (!value) {
      console.log("veri yazılıyor");
      const val = {
        name: "john doe",
        age: 30
      };
      const write = await client.json.set(KEY, '$', val)

      if(write === 'OK'){
        value = val
      }
    }

    res.json({
      message: "redis json",
      value: value,
    });
  });

  // deletion 
  router.get('/redis/delete', async (req,res) => {
     let KEY = 'string'
     await client.del(KEY)

     KEY = "hash",
     await client.del(KEY)


     KEY = "list",
     await client.del(KEY)


     KEY = "set",
     await client.del(KEY)


     KEY = "zset",
     await client.del(KEY)


     KEY = "json",
     await client.json.del(KEY, '$')


     res.json({
        message: "keys are deleted"
     })
  })
};
