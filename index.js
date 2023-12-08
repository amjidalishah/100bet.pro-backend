const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const cron = require("node-cron");
const http = require("http"); // Import the 'http' module
const socketIo = require("socket.io"); // Import 'socket.io'
const { GenerateReferralCode } = require("./utils/GenerateReferalCode");
const { AdminRouter } = require("./routes/admin.route");
const { TransactionRouter } = require("./routes/transaction.route");
const { BetRouter } = require("./routes/bet.route");

const { PromotionRoute } = require("./routes/promotion.route");
const { NotificationRoute } = require("./routes/notification.route");
const { RulesRegulation } = require("./routes/rulesRegulation.route");
const { default: axios } = require("axios");
const {
  saveLeague,
} = require("./controllers/savecontroller/league.controller");
const { SaveMatch } = require("./controllers/savecontroller/match.controller");
const { MatchRoute } = require("./routes/match.route");
const { FormatDate } = require("./utils/FormatDataFor");
const { PaymentRoute } = require("./routes/payment.route");
const { LogoFavRouter } = require("./routes/logofav.route");
const {
  GetBalance,
  Deduct,
  Settle,
  Rollback,
  Cancel,
  Bonus,
  ReturnStake,
  GetBetStatus,
} = require("./controllers/casino.controllers");
const { SportRoute } = require("./routes/sport.route");
const { LeagueRoute } = require("./routes/league.route");
const { CasinoGameRoute } = require("./routes/casinogame.route");
const { GameSliderRoute } = require("./routes/gameslider.route");
const { CasinoProviderRouter } = require("./routes/casinoprovider.route");
const { ReferAndEarnRoute } = require("./routes/refer&earn.route");
const { GetCurrentTime } = require("./utils/GetCurrentTime");
const { ResultRouter } = require("./routes/result.route");
require("dotenv").config();

const server = express();
const httpServer = http.createServer(server); // Create an HTTP server

const port = process.env.PORT || 3000;
const io = socketIo(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

// Middleware for parsing JSON requests
server.use(express.json());
server.use(cors());
server.use("/api/user", AdminRouter);
server.use("/api/transaction", TransactionRouter);
server.use("/api/bet", BetRouter);
server.use("/api/notification", NotificationRoute);
server.use("/api/promotion", PromotionRoute);
server.use("/api/rules", RulesRegulation);
server.use("/api/sport", SportRoute);
server.use("/api/league", LeagueRoute);
server.use("/api/match", MatchRoute);
server.use("/api/payment", PaymentRoute);
server.use("/api/logofav", LogoFavRouter);
server.use("/api/casinogame", CasinoGameRoute);
server.use("/api/gameslider", GameSliderRoute);
server.use("/api/casinoprovider", CasinoProviderRouter);
server.use("/api/referearn", ReferAndEarnRoute);
server.use("/api/result", ResultRouter);
server.post("/GetBalance", GetBalance);
server.post("/Deduct", Deduct);
server.post("/Settle", Settle);
server.post("/RollBack", Rollback);
server.post("/Cancel", Cancel);
server.post("/Bonus", Bonus);
server.post("/ReturnStake", ReturnStake);

server.post("/GetBetStatus", GetBetStatus);

// Define a route for /api/home
server.get("/api/home", async (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    data: null,
    message: "Welcome to the home API! updated with CICD update tested",
  });
});

server.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    data: null,
    message: "Route not found.",
  });
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

httpServer.listen(port, async (err) => {
  if (err) {
    console.log("inside server function");
    console.log(err);
  } else {
    try {
      await connection;
      console.log(port || 8090, "connected");
    } catch (error) {
      console.log("Error while connecting to the database:", error);
    }
  }
});

// saveLeague()
// SaveMatch()

io.on("connection", (socket) => {
  console.log("Client connected");
  let cricketScoreInterval;
  let generalScoreInterval;
  let oddsDataInterval;
  let tossDataInterval;
  let sessionDataInterval;
  let bookmakerDataInterval;
  let matchDataInterval;
  let fancyDataInterval;
  let generalTennisSoccerScoreInterval;
  // Listen for the "startFetchingCricketScore" event from the client
  socket.on("startFetchingCricketScore", (matchId) => {
    console.log(`Client wants to fetch cricket score for MatchID: ${matchId}`);
    // Set up an interval to fetch and emit cricket score data every 3 seconds
    cricketScoreInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/score_v1.php?Action=score&match_id=${matchId}`;
        const response = await axios.post(
          "http://3.108.170.225:8080/putapi",
          {
            url,
          },
          { timeout: 5000 }
        );

        if (!response.data.res) {
          socket.emit("cricketScoreData", []); // Send an empty array to indicate no data
          clearInterval(cricketScoreInterval);
          return;
        }

        // Emit the fetched cricket score data to the client
        socket.emit("cricketScoreData", response.data.res || []);
      } catch (error) {
        console.error("Error fetching cricket score data:", error);
      }
    }, 3000);
  });

  // Listen for the "startFetchingScore" event from the client
  socket.on("startFetchingScore", (matchId) => {
    console.log(`Client wants to fetch general score for MatchID: ${matchId}`);
    generalScoreInterval = setInterval(async () => {
      try {
        const url = `http://172.105.54.97:8085/api/cricketscoreballyball?id=${matchId}`;
        const response = await axios.post(
          "http://3.108.170.225:8080/putapi",
          {
            url,
          },
          { timeout: 5000 }
        );

        if (!response.data.res) {
          socket.emit("scoreData", []); // Send an empty array to indicate no data
          clearInterval(generalScoreInterval);
          return;
        }

        // Emit the fetched general score data to the client
        socket.emit("scoreData", response?.data?.res?.data || []);
      } catch (error) {
        console.error("Error fetching general score data:", error);
      }
    }, 3000);
  });

  socket.on("startFetchingTennisSoccerScore", (matchId) => {
    console.log(
      `Client wants to fetch  score for tennis or soccer matchID: ${matchId}`
    );
    generalTennisSoccerScoreInterval = setInterval(async () => {
      try {
        const url = `http://172.105.54.97:8085/api/getScoreData?eventid=${matchId}`;
        const response = await axios.post(
          "http://3.108.170.225:8080/putapi",
          {
            url,
          },
          { timeout: 5000 }
        );

        if (!response.data.res) {
          socket.emit("TennisSoccerScoreData", []); // Send an empty array to indicate no data
          clearInterval(generalTennisSoccerScoreInterval);
          return;
        }

        // Emit the fetched general score data to the client
        socket.emit("TennisSoccerScoreData", response?.data?.res?.data || []);
      } catch (error) {
        console.error("Error fetching tennis soccer score data:", error);
      }
    }, 2000);
  });

  // match odds
  socket.on("startFetchingOdds", (match_id) => {
    console.log(`Client wants to fetch data for EventID: ${match_id}`);
    // Set up an interval to fetch and emit data every second
    oddsDataInterval = setInterval(async () => {
      try {
        const url1 = `http://172.105.54.97:8085/api/getOdds?eventId=${match_id}`;
        const response1 = await axios.post(
          "http://3.108.170.225:8080/putapi",
          {
            url: url1,
          },
          { timeout: 5000 }
        );

        // console.log(response1?.data?.res?.data?.t2,"l1")
        if (!response1?.data?.res) {
          socket.emit("oddsData", []); // Send an empty array to indicate no data
          clearInterval(oddsDataInterval);

          return;
        }
        // console.log(response1.data.res)

        // Emit the fetched data to the client
        socket.emit("oddsData", response1?.data?.res?.data || []);
      } catch (error) {
        clearInterval(oddsDataInterval);
        socket.emit("oddsData", []);
        console.error("Error fetching data:", error);
      }
    }, 3000);
  });

  // match bookmaker

  // Listen for the "startFetching" event from the client
  socket.on("startFetchingBookmaker", (match_id) => {
    console.log(
      `Client wants to fetch bookmaaker data for EventID: ${match_id}`
    );
    // Set up an interval to fetch and emit data every second
    bookmakerDataInterval = setInterval(async () => {
      try {
        const url1 = `http://172.105.54.97:8085/api/getOdds?eventId=${match_id}`;
        const response1 = await axios.post(
          "http://3.108.170.225:8080/putapi",
          {
            url: url1,
          },
          { timeout: 5000 }
        );
        // console.log(response1?.data?.res?.data?.t2,"l2")
        // console.log(response1.data.res)
        if (!response1?.data?.res) {
          socket.emit("bookmakerData", []); // Send an empty array to indicate no data
          clearInterval(bookmakerDataInterval);
          return;
        }

        // Emit the fetched data to the client
        socket.emit("bookmakerData", response1?.data?.res?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000);
  });

  // match fancy
  // Listen for the "startFetching" event from the client
  socket.on("startFetchingFancy", (match_id) => {
    console.log(`Client wants to fetch data for EventID: ${match_id}`);
    // Set up an interval to fetch and emit data every second
    fancyDataInterval = setInterval(async () => {
      try {
        const url1 = `http://172.105.54.97:8085/api/getOdds?eventId=${match_id}`;
        const response1 = await axios.post(
          "http://3.108.170.225:8080/putapi",
          {
            url: url1,
          },
          { timeout: 5000 }
        );
        // console.log(response1?.data?.res?.data?.t3, "ll3")
        if (!response1?.data?.res) {
          socket.emit("fancyData", []); // Send an empty array to indicate no data
          clearInterval(fancyDataInterval);
          return;
        }
        // console.log(response1.data.res)
        // Emit the fetched data to the client
        socket.emit("fancyData", response1?.data?.res?.data || []);
      } catch (error) {
        socket.emit("fancyData", []);
        console.error("Error fancy data:", error);
      }
    }, 3000);
  });

  socket.on("startDataFetching", async (category) => {
    console.log(`Client wants to fetch data for EventID: ${category}`);
    // Set up an interval to fetch and emit data every second
    // fancyDataInterval = setInterval(async () => {
    try {
      const url = `http://172.105.54.97:8085/api/${category}`;
      const response = await axios.post(
        "http://3.108.170.225:8080/putapi",
        {
          url,
        },
        { timeout: 5000 }
      );
      // console.log(response1?.data?.res?.data?.t3, "ll3")
      if (!response?.data?.res) {
        socket.emit("Data", []); // Send an empty array to indicate no data
        // clearInterval(fancyDataInterval);
        return;
      }
      // console.log(response1.data.res)
      // Emit the fetched data to the client
      socket.emit("Data", response?.data?.res || []);
    } catch (error) {
      console.error("Error fancy data:", error);
    }
    // }, 2000);
  });

  socket.on("startFetchingMatch", (category) => {
    console.log(`Client wants to fetch match for : ${category}`);
    // Set up an interval to fetch and emit general score data every 3 seconds
    matchDataInterval = setInterval(async () => {
      try {
        const url = `http://172.105.54.97:8085/api/${category}`;
        const response = await axios.post("http://3.108.170.225:8080/putapi", {
          url,
        });

        if (!response.data.res) {
          socket.emit("matchData", []); // Send an empty array to indicate no data
          clearInterval(matchDataInterval);
          return;
        }

        // Emit the fetched general score data to the client
        socket.emit("matchData", response.data.res || []);
      } catch (error) {
        console.error("Error fetching general score data:", error);
      }
    }, 10000);
  });

  // Admin emits an event to the backend
  socket.on("adminEvent", (data, user_id) => {
    console.log("Received admin event with data:", data);

    // Backend processes the data and emits another event to the user frontend
    const processedData = data;
    io.emit("userNotification", processedData, user_id); // Sending the event to all connected clients (you can use socket.to(room).emit for specific rooms)
    console.log("Emitted user event with processed data:", processedData);
  });

  socket.on("userEvent", (data, user_id) => {
    console.log("Received admin event with data:", data);

    // Backend processes the data and emits another event to the user frontend
    const processedData = data;
    io.emit("adminNotification", processedData, user_id); // Sending the event to all connected clients (you can use socket.to(room).emit for specific rooms)
    console.log("Emitted user event with processed data:", processedData);
  });

  // user to admin withdraw / deposit transaction notifications
  socket.on("startAdminTransaction", async (data, type) => {
    console.log(`Client wants to fetch match for : ${data}`);
    // Set up an interval to fetch and emit general score data every 3 seconds

    // const url = `http://172.105.54.97:8085/api/${category}`;
    // const notification = await axios.post(
    //   "http://3.108.170.225:8080/putapi",
    //   data
    // );

    //
    console.log(data, type);
    // promotion
    // deposit
    // withdraw
    // Emit the fetched general score data to the client
    socket.emit("adminTransaction", "noting" || {});
  });

  // admin to user withdraw / deposit transaction notifications
  socket.on("startUserTransaction", async (data) => {
    console.log(`Client wants to fetch match for : ${data}`);
    // Set up an interval to fetch and emit general score data every 3 seconds
    try {
      const url = `http://172.105.54.97:8085/api/${category}`;
      const notification = await axios.post(
        "http://3.108.170.225:8080/putapi",
        data
      );

      // Emit the fetched general score data to the client
      socket.emit("userTransaction", response.data || {});
    } catch (error) {
      console.error("Error fetching general notification data:", error);
    }
  });

  // Listen for the "stopFetching" event from the client

  // Listen for the "stopFetching" event from the client for both cricket score and general score
  socket.on("stopFetching", () => {
    console.log("Client requested to stop fetching data");
    // Clear the intervals when the client disconnects or requests to stop

    clearInterval(cricketScoreInterval);
    clearInterval(generalScoreInterval);
    clearInterval(oddsDataInterval);
    clearInterval(bookmakerDataInterval);
    clearInterval(tossDataInterval);
    clearInterval(fancyDataInterval);
    clearInterval(matchDataInterval);
    clearInterval(generalTennisSoccerScoreInterval);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Clear the intervals when the client disconnects
    clearInterval(cricketScoreInterval);
    clearInterval(generalScoreInterval);
    clearInterval(oddsDataInterval);
    clearInterval(bookmakerDataInterval);
    clearInterval(tossDataInterval);
    clearInterval(fancyDataInterval);
    clearInterval(matchDataInterval);
    clearInterval(generalTennisSoccerScoreInterval);
  });
});

// console.log(GetCurrentTime().split(" ")[0])

// function paginateArray(array, page, limit) {
//   // Calculate start and end indexes of the current page
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;

//   // Get the sliced data for the current page
//   const paginatedData = array.slice(startIndex, endIndex);

//   return paginatedData;
// }

// // Example array data
// const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// // Get page 2 with limit of 3 items per page
// const page2 = paginateArray(data, 2, 3);
// console.log(page2); // Output: [4, 5, 6]

// Socket.io code
// cricket
// Define a function to be executed by the cron job
const SaveLeagueCornJob = () => {
  console.log("Cron job executed at:", new Date());
  // Add your task to be executed every 30 seconds here
  // Start the server
  // saveLeague()
};

const SaveMatchCornJob = () => {
  console.log("Cron job executed at:", new Date());
  // Add your task to be executed every 30 seconds here
  // Start the server
};
// SaveMatch()

// // Schedule the cron job to run every 2 hours.
cron.schedule("0 */2 * * *", SaveLeagueCornJob);

cron.schedule("30 */2.5 * * *", SaveMatchCornJob);

// {
//   "res": {
//     "success": true,
//     "data": [
//       {
//         "gameId": "32703507",
//         "marketId": "1.219498666",
//         "eid": "4",
//         "eventName": "Dolphins v Titans / Oct 11 2023  4:30PM (IST)",
//         "inPlay": "True",
//         "tv": "True",
//         "back1": 1.57,
//         "lay1": 1.59,
//         "back11": 2.68,
//         "lay11": 2.76,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "True",
//         "f": "True",
//         "vir": 1
//       },
//       {
//         "gameId": "561013872",
//         "marketId": "1.561013872",
//         "eid": "4",
//         "eventName": "Adelaide Strikers XI v  Melbourne Renegades XI / Oct 11 2023  8:30PM (IST)",
//         "inPlay": "True",
//         "tv": "False",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "True",
//         "vir": 0
//       },
//       {
//         "gameId": "1110112133",
//         "marketId": "1.111011213415",
//         "eid": "4",
//         "eventName": "Bangladesh T10 v South Africa T10 / Oct 11 2023  9:15PM (IST)",
//         "inPlay": "True",
//         "tv": "True",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "True",
//         "vir": 2
//       },
//       {
//         "gameId": "1110112203",
//         "marketId": "1.111011220515",
//         "eid": "4",
//         "eventName": "West Indies T10 v Sri Lanka T10 / Oct 11 2023  9:15PM (IST)",
//         "inPlay": "True",
//         "tv": "True",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "True",
//         "f": "False",
//         "vir": 2
//       },
//       {
//         "gameId": "1110112156",
//         "marketId": "1.111011215615",
//         "eid": "4",
//         "eventName": "South Africa T10 v India T10 / Oct 11 2023  9:30PM (IST)",
//         "inPlay": "True",
//         "tv": "True",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "True",
//         "vir": 2
//       },
//       {
//         "gameId": "462025959",
//         "marketId": "1.462025959",
//         "eid": "4",
//         "eventName": "JT XI v GAW XI / Oct 11 2023  9:30PM (IST)",
//         "inPlay": "True",
//         "tv": "False",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "True",
//         "vir": 0
//       },
//       {
//         "gameId": "1110112248",
//         "marketId": "1.111011224815",
//         "eid": "4",
//         "eventName": "New Zealand T10 v India T10 / Oct 11 2023 10:30PM (IST)",
//         "inPlay": "False",
//         "tv": "False",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "True",
//         "vir": 2
//       },
//       {
//         "gameId": "1110112322",
//         "marketId": "1.111011232315",
//         "eid": "4",
//         "eventName": "New Zealand T10 v Sri Lanka T10 / Oct 11 2023 10:35PM (IST)",
//         "inPlay": "False",
//         "tv": "False",
//         "back1": 0,
//         "lay1": 0,
//         "back11": 0,
//         "lay11": 0,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "False",
//         "vir": 2
//       },
//       {
//         "gameId": "32700022",
//         "marketId": "1.219421178",
//         "eid": "4",
//         "eventName": "Australia Women v West Indies Women / Oct 12 2023  4:35AM (IST)",
//         "inPlay": "False",
//         "tv": "False",
//         "back1": 1.03,
//         "lay1": 1.04,
//         "back11": 27,
//         "lay11": 28,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "False",
//         "f": "False",
//         "vir": 1
//       },
//       {
//         "gameId": "32686875",
//         "marketId": "1.219205194",
//         "eid": "4",
//         "eventName": "Australia v South Africa / Oct 12 2023  2:00PM (IST)",
//         "inPlay": "False",
//         "tv": "False",
//         "back1": 1.74,
//         "lay1": 1.75,
//         "back11": 2.34,
//         "lay11": 2.36,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "True",
//         "f": "True",
//         "vir": 1
//       },
//       {
//         "gameId": "32700938",
//         "marketId": "1.219440480",
//         "eid": "4",
//         "eventName": "New Zealand v Bangladesh / Oct 13 2023  2:00PM (IST)",
//         "inPlay": "False",
//         "tv": "False",
//         "back1": 1.34,
//         "lay1": 1.35,
//         "back11": 3.9,
//         "lay11": 3.95,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "True",
//         "f": "True",
//         "vir": 1
//       },
//       {
//         "gameId": "32700940",
//         "marketId": "1.219443524",
//         "eid": "4",
//         "eventName": "India v Pakistan / Oct 14 2023  2:00PM (IST)",
//         "inPlay": "False",
//         "tv": "False",
//         "back1": 1.48,
//         "lay1": 1.49,
//         "back11": 3,
//         "lay11": 3.1,
//         "back12": 0,
//         "lay12": 0,
//         "m1": "True",
//         "f": "True",
//         "vir": 1
//       }
//     ]
//   }
// }

// soccer correct
// {
// "res": {
//   "success": true,
//   "data": {
//     "t1": [

// {
//   "gmid": 909335267,
//   "ename": "Tiller U19 - Nardo U 19 U19",
//   "etid": 1,
//   "cid": 7077069,
//   "cname": "NORWAY U19 Elite League",
//   "iplay": false,
//   "stime": "10/11/2023 10:30:00 PM",
//   "tv": false,
//   "bm": false,
//   "f": false,
//   "f1": false,
//   "oid": 1,
//   "iscc": 0,
//   "mid": 7492615699270,
//   "mname": "MATCH_ODDS",
//   "status": "SUSPENDED",
//   "rc": 3,
//   "gscode": 0,
//   "m": 1,
//   "gtype": "match",
//   "section": [
//     {
//       "sid": 687031,
//       "sno": 1,
//       "gstatus": "SUSPENDED",
//       "gscode": 0,
//       "nat": "Tiller U19 ",
//       "odds": [
//         {
//           "sid": 687031,
//           "psid": 535951,
//           "odds": 0,
//           "otype": "back",
//           "oname": "back1",
//           "tno": 0,
//           "size": 7500000
//         },
//         {
//           "sid": 687031,
//           "psid": 535951,
//           "odds": 0,
//           "otype": "lay",
//           "oname": "lay1",
//           "tno": 0,
//           "size": 7500000
//         }
//       ]
//     },
//     {
//       "sid": 687032,
//       "sno": 3,
//       "gstatus": "SUSPENDED",
//       "gscode": 0,
//       "nat": "Nardo U 19 U19",
//       "odds": [
//         {
//           "sid": 687032,
//           "psid": 535952,
//           "odds": 0,
//           "otype": "back",
//           "oname": "back1",
//           "tno": 0,
//           "size": 7500000
//         },
//         {
//           "sid": 687032,
//           "psid": 535952,
//           "odds": 0,
//           "otype": "lay",
//           "oname": "lay1",
//           "tno": 0,
//           "size": 7500000
//         }
//       ]
//     },
//     {
//       "sid": 687033,
//       "sno": 2,
//       "gstatus": "SUSPENDED",
//       "gscode": 0,
//       "nat": "Draw",
//       "odds": [
//         {
//           "sid": 687033,
//           "psid": 535953,
//           "odds": 0,
//           "otype": "back",
//           "oname": "back1",
//           "tno": 0,
//           "size": 7500000
//         },
//         {
//           "sid": 687033,
//           "psid": 535953,
//           "odds": 0,
//           "otype": "lay",
//           "oname": "lay1",
//           "tno": 0,
//           "size": 7500000
//         }
//       ]
//     }
//   ]
// },
// {
//   "gmid": 918169143,
//   "ename": "Belarus v Romania",
//   "etid": 1,
//   "cid": 4933384,
//   "cname": "EUROPE  Euro - Qualification",
//   "iplay": false,
//   "stime": "10/13/2023 12:15:00 AM",
//   "tv": false,
//   "bm": false,
//   "f": false,
//   "f1": false,
//   "oid": 1,
//   "iscc": 0,
//   "mid": 6143379314409,
//   "mname": "MATCH_ODDS",
//   "status": "open",
//   "rc": 3,
//   "gscode": 1,
//   "m": 1,
//   "gtype": "match",
//   "section": [
//     {
//       "sid": 69610,
//       "sno": 1,
//       "gstatus": "ACTIVE",
//       "gscode": 1,
//       "nat": "Belarus",
//       "odds": [
//         {
//           "sid": 69610,
//           "psid": 29634,
//           "odds": 7.4,
//           "otype": "back",
//           "oname": "back1",
//           "tno": 0,
//           "size": 71.43
//         },
//         {
//           "sid": 69610,
//           "psid": 29634,
//           "odds": 7.6,
//           "otype": "lay",
//           "oname": "lay1",
//           "tno": 0,
//           "size": 45
//         }
//       ]
//     },
//     {
//       "sid": 787211,
//       "sno": 3,
//       "gstatus": "ACTIVE",
//       "gscode": 1,
//       "nat": "Romania",
//       "odds": [
//         {
//           "sid": 787211,
//           "psid": 26,
//           "odds": 1.63,
//           "otype": "lay",
//           "oname": "lay1",
//           "tno": 0,
//           "size": 548.77
//         },
//         {
//           "sid": 787211,
//           "psid": 26,
//           "odds": 1.62,
//           "otype": "back",
//           "oname": "back1",
//           "tno": 0,
//           "size": 76.24
//         }
//       ]
//     },
//     {
//       "sid": 666032,
//       "sno": 2,
//       "gstatus": "ACTIVE",
//       "gscode": 1,
//       "nat": "The Draw",
//       "odds": [
//         {
//           "sid": 666032,
//           "psid": 58805,
//           "odds": 4,
//           "otype": "back",
//           "oname": "back1",
//           "tno": 0,
//           "size": 401.24
//         },
//         {
//           "sid": 666032,
//           "psid": 58805,
//           "odds": 4.1,
//           "otype": "lay",
//           "oname": "lay1",
//           "tno": 0,
//           "size": 82.88
//         }
//       ]
//     }
//   ]
// }
// ],

//   }

// tennis soccer
// {
//   "res": {
//     "success": true,
//     "data": {
//       "t1": [
//         {
//           "gmid": 476978022,
//           "ename": "Kopriva v Darderi",
//           "etid": 2,
//           "cid": 6181750,
//           "cname": "CHALLENGER MEN - SINGLES BUENOS AIRES 2(ARGENTINA",
//           "iplay": true,
//           "oid": 1,
//           "stime": "10/11/2023 7:30:00 PM",
//           "tv": true,
//           "bm": true,
//           "f": false,
//           "f1": false,
//           "iscc": 0,
//           "mid": 5900932838259,
//           "mname": "MATCH_ODDS",
//           "status": "open",
//           "rc": 2,
//           "gscode": 1,
//           "m": 2,
//           "gtype": "match",
//           "section": [
//             {
//               "sid": 85141,
//               "sno": 3,
//               "gstatus": "ACTIVE",
//               "gscode": 1,
//               "nat": "Luciano Darderi",
//               "odds": [
//                 {
//                   "sid": 85141,
//                   "psid": 26309941,
//                   "odds": 1.66,
//                   "otype": "lay",
//                   "oname": "lay1",
//                   "tno": 0,
//                   "size": 158.33
//                 },
//                 {
//                   "sid": 85141,
//                   "psid": 26309941,
//                   "odds": 1.61,
//                   "otype": "back",
//                   "oname": "back1",
//                   "tno": 0,
//                   "size": 2
//                 }
//               ]
//             },
//             {
//               "sid": 48280,
//               "sno": 1,
//               "gstatus": "ACTIVE",
//               "gscode": 1,
//               "nat": "Vit Kopriva",
//               "odds": [
//                 {
//                   "sid": 48280,
//                   "psid": 9543224,
//                   "odds": 2.5,
//                   "otype": "back",
//                   "oname": "back1",
//                   "tno": 0,
//                   "size": 105.13
//                 },
//                 {
//                   "sid": 48280,
//                   "psid": 9543224,
//                   "odds": 2.64,
//                   "otype": "lay",
//                   "oname": "lay1",
//                   "tno": 0,
//                   "size": 3.22
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           "gmid": 488443646,
//           "ename": "A. Barrena / H. Casanova - Orlando Luz / Joao Lucas Reis Da Silva",
//           "etid": 2,
//           "cid": 6751850,
//           "cname": "CHALLENGER MEN - DOUBLES Buenos Aires (Argentina)",
//           "iplay": true,
//           "oid": 1,
//           "stime": "10/11/2023 9:00:00 PM",
//           "tv": true,
//           "bm": false,
//           "f": false,
//           "f1": false,
//           "iscc": 0,
//           "mid": 5344469159555,
//           "mname": "MATCH_ODDS",
//           "status": "ACTIVE",
//           "rc": 2,
//           "gscode": 1,
//           "m": 2,
//           "gtype": "match",
//           "section": [
//             {
//               "sid": 507781,
//               "sno": 1,
//               "gstatus": "OPEN",
//               "gscode": 1,
//               "nat": "A. Barrena / H. Casanova ",
//               "odds": [
//                 {
//                   "sid": 507781,
//                   "psid": 604511,
//                   "odds": 3.25,
//                   "otype": "back",
//                   "oname": "back1",
//                   "tno": 0,
//                   "size": 5000000
//                 },
//                 {
//                   "sid": 507781,
//                   "psid": 604511,
//                   "odds": 0,
//                   "otype": "lay",
//                   "oname": "lay1",
//                   "tno": 0,
//                   "size": 5000000
//                 }
//               ]
//             },
//             {
//               "sid": 507782,
//               "sno": 3,
//               "gstatus": "OPEN",
//               "gscode": 1,
//               "nat": "Orlando Luz / Joao Lucas Reis Da Silva",
//               "odds": [
//                 {
//                   "sid": 507782,
//                   "psid": 604512,
//                   "odds": 1.3,
//                   "otype": "back",
//                   "oname": "back1",
//                   "tno": 0,
//                   "size": 5000000
//                 },
//                 {
//                   "sid": 507782,
//                   "psid": 604512,
//                   "odds": 0,
//                   "otype": "lay",
//                   "oname": "lay1",
//                   "tno": 0,
//                   "size": 5000000
//                 }
//               ]
//             }
//           ]
//         },]

// }

// fanct book maker odds
// {
//   "res": {
//     "success": true,
//     "data": {
//       "t1": [
//         [
//           {
//             "mid": "1.219443524",
//             "mstatus": "OPEN",
//             "mname": "MATCH_ODDS",
//             "iplay": "False",
//             "sid": "414464",
//             "nat": "India",
//             "b1": "1.49",
//             "bs1": "8573.97",
//             "b2": "1.48",
//             "bs2": "2209.30",
//             "b3": "1.47",
//             "bs3": "3005.38",
//             "l1": "1.50",
//             "ls1": "5010.87",
//             "l2": "1.51",
//             "ls2": "5908.97",
//             "l3": "1.52",
//             "ls3": "5014.77",
//             "status": "ACTIVE",
//             "srno": "1",
//             "gtype": "Match",
//             "utime": "0"
//           },
//           {
//             "mid": "1.219443524",
//             "mstatus": "OPEN",
//             "mname": "MATCH_ODDS",
//             "iplay": "False",
//             "sid": "7461",
//             "nat": "Pakistan",
//             "b1": "3.00",
//             "bs1": "2505.43",
//             "b2": "2.96",
//             "bs2": "3014.37",
//             "b3": "2.94",
//             "bs3": "3.00",
//             "l1": "3.05",
//             "ls1": "4188.60",
//             "l2": "3.10",
//             "ls2": "1054.76",
//             "l3": "3.15",
//             "ls3": "1402.51",
//             "status": "ACTIVE",
//             "srno": "2",
//             "gtype": "Match",
//             "utime": "0"
//           }
//         ]
//       ],
//       "t2": [
//         {
//           "bm1": [
//             {
//               "mid": "1.219443524",
//               "mname": "Bookmaker",
//               "remark": "Assembly Election 2023 Bets Started In Our Exchange",
//               "remark1": "",
//               "min": "100.00",
//               "max": "100000.00",
//               "sid": "1",
//               "nat": "India",
//               "b1": "48.00",
//               "bs1": "100000.00",
//               "l1": "52.00",
//               "ls1": "100000.00",
//               "s": "ACTIVE",
//               "sr": "1",
//               "gtype": "Match1",
//               "utime": "0",
//               "b2": "0.00",
//               "bs2": "0.00",
//               "b3": "0.00",
//               "bs3": "0.00",
//               "l2": "0.00",
//               "ls2": "0.00",
//               "l3": "0.00",
//               "ls3": "0.00",
//               "b1s": "True",
//               "b2s": "False",
//               "b3s": "False",
//               "l1s": "True",
//               "l2s": "False",
//               "l3s": "False"
//             },
//             {
//               "mid": "1.219443524",
//               "mname": "Bookmaker",
//               "remark": "Assembly Election 2023 Bets Started In Our Exchange",
//               "remark1": "",
//               "min": "100.00",
//               "max": "100000.00",
//               "sid": "2",
//               "nat": "Pakistan",
//               "b1": "0.00",
//               "bs1": "0.00",
//               "l1": "0.00",
//               "ls1": "0.00",
//               "s": "SUSPENDED",
//               "sr": "2",
//               "gtype": "Match1",
//               "utime": "0",
//               "b2": "0.00",
//               "bs2": "0.00",
//               "b3": "0.00",
//               "bs3": "0.00",
//               "l2": "0.00",
//               "ls2": "0.00",
//               "l3": "0.00",
//               "ls3": "0.00",
//               "b1s": "False",
//               "b2s": "False",
//               "b3s": "False",
//               "l1s": "False",
//               "l2s": "False",
//               "l3s": "False"
//             }
//           ],
//           "bm2": []
//         }
//       ],
//       "t3": null,
//       "t4": [
//         {
//           "mid": "1.219443524",
//           "sid": "2538",
//           "nat": "2nd inn 30 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2537",
//           "nat": "2nd inn 30 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2536",
//           "nat": "2nd inn 25 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2535",
//           "nat": "2nd inn 25 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2534",
//           "nat": "2nd inn 20 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2533",
//           "nat": "2nd inn 20 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2532",
//           "nat": "2nd inn 15 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2531",
//           "nat": "2nd inn 15 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2530",
//           "nat": "2nd inn 10 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2529",
//           "nat": "2nd inn 10 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2528",
//           "nat": "2nd inn 5 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2527",
//           "nat": "2nd inn 5 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "4"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2526",
//           "nat": "1st inn 50 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2525",
//           "nat": "1st inn 50 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2524",
//           "nat": "1st inn 45 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2523",
//           "nat": "1st inn 45 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2522",
//           "nat": "1st inn 40 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2521",
//           "nat": "1st inn 40 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2520",
//           "nat": "1st inn 35 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2519",
//           "nat": "1st inn 35 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2518",
//           "nat": "1st inn 30 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2517",
//           "nat": "1st inn 30 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2516",
//           "nat": "1st inn 25 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2515",
//           "nat": "1st inn 25 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2514",
//           "nat": "1st inn 20 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2513",
//           "nat": "1st inn 20 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2512",
//           "nat": "1st inn 15 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2511",
//           "nat": "1st inn 15 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2510",
//           "nat": "1st inn 10 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2509",
//           "nat": "1st inn 10 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2508",
//           "nat": "1st inn 5 over even run bhav(IND vs PAK)adv",
//           "b1": "0.00",
//           "bs1": "500000.00",
//           "l1": "1.98",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         },
//         {
//           "mid": "1.219443524",
//           "sid": "2507",
//           "nat": "1st inn 5 over odd run bhav(IND vs PAK)adv",
//           "b1": "1.98",
//           "bs1": "500000.00",
//           "l1": "0.00",
//           "ls1": "500000.00",
//           "gtype": "OE",
//           "utime": "0",
//           "gvalid": "0",
//           "gstatus": "",
//           "remark": "",
//           "min": "10.00",
//           "max": "100000.00",
//           "srno": "3"
//         }
//       ]
//     }
//   }
// }
