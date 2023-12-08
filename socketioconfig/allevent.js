

// Socket.io code
const {io} =require("../index")

console.log("jjjj")
io.on("connection", (socket) => {
  console.log("Client connected");
  let cricketScoreInterval;
  let generalScoreInterval;
  let oddsDataInterval;
  let tossDataInterval;
  let sessionDataInterval;
  let bookmakerDataInterval;
  // Listen for the "startFetchingCricketScore" event from the client
  socket.on("startFetchingCricketScore", (matchId) => {
    console.log(`Client wants to fetch cricket score for MatchID: ${matchId}`);
    // Set up an interval to fetch and emit cricket score data every 3 seconds
    cricketScoreInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/score_v1.php?Action=score&match_id=${matchId}`;
        const response = await axios.post("http://35.154.231.183:8080/putapi", {
          url,
        });

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
    }, 2000);
  });

  // Listen for the "startFetchingScore" event from the client
  socket.on("startFetchingScore", (matchId) => {
    console.log(`Client wants to fetch general score for MatchID: ${matchId}`);
    // Set up an interval to fetch and emit general score data every 3 seconds
    generalScoreInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/score_v1.php?Action=all_event_score&match_id=${matchId}`;
        const response = await axios.post("http://35.154.231.183:8080/putapi", {
          url,
        });

        if (!response.data.res) {
          socket.emit("scoreData", []); // Send an empty array to indicate no data
          clearInterval(generalScoreInterval);
          return;
        }

        // Emit the fetched general score data to the client
        socket.emit("scoreData", response.data.res || []);
      } catch (error) {
        console.error("Error fetching general score data:", error);
      }
    }, 2000);
  });

  // match odds
  socket.on("startFetchingOdds", (eventID) => {
    console.log(`Client wants to fetch data for EventID: ${eventID}`);
    // Set up an interval to fetch and emit data every second
    oddsDataInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketTypes&EventID=${eventID}`;
        const response = await axios.post("http://35.154.231.183:8080/putapi", {
          url,
        });
        const marketId = response?.data?.res[0]?.marketId;

        if (!marketId) {
          socket.emit("oddsData", []); // Send an empty array to indicate no data
          clearInterval(oddsDataInterval);
          return;
        }

        const url1 = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketBookOdds&MarketID=${marketId}`;
        const response1 = await axios.post(
          "http://35.154.231.183:8080/putapi",
          {
            url: url1,
          }
        );

        // Emit the fetched data to the client
        socket.emit("oddsData", response1.data.res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000);
  });

  // match bookmaker

  // Listen for the "startFetching" event from the client
  socket.on("startFetchingBookmaker", (eventID) => {
    console.log(
      `Client wants to fetch bookmaaker data for EventID: ${eventID}`
    );
    // Set up an interval to fetch and emit data every second
    bookmakerDataInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketTypes&EventID=${eventID}`;
        const response = await axios.post("http://35.154.231.183:8080/putapi", {
          url,
        });
        const marketId = response?.data?.res[0]?.marketId;

        if (!marketId) {
          socket.emit("bookmakerData", []); // Send an empty array to indicate no data
          clearInterval(bookmakerDataInterval);
          return;
        }

        const url1 = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketBookOdds&MarketID=${marketId}`;
        const response1 = await axios.post(
          "http://35.154.231.183:8080/putapi",
          {
            url: url1,
          }
        );

        // Emit the fetched data to the client
        socket.emit("bookmakerData", response1.data.res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000);
  });

  // match toss
  // Listen for the "startFetching" event from the client
  socket.on("startFetchingToss", (eventID) => {
    console.log(`Client wants to fetch data for EventID: ${eventID}`);
    // Set up an interval to fetch and emit data every second
    tossDataInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketTypes&EventID=${eventID}`;
        const response = await axios.post("http://35.154.231.183:8080/putapi", {
          url,
        });
        const marketId = response?.data?.res[0]?.marketId;

        if (!marketId) {
          socket.emit("tossData", []); // Send an empty array to indicate no data
          clearInterval(tossDataInterval);
          return;
        }

        const url1 = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketBookOdds&MarketID=${marketId}`;
        const response1 = await axios.post(
          "http://35.154.231.183:8080/putapi",
          {
            url: url1,
          }
        );

        // Emit the fetched data to the client
        socket.emit("tossData", response1.data.res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000);
  });

  // match fancy
  // Listen for the "startFetching" event from the client
  socket.on("startFetchingFancy", (eventID) => {
    console.log(`Client wants to fetch data for EventID: ${eventID}`);
    // Set up an interval to fetch and emit data every second
    fancyDataInterval = setInterval(async () => {
      try {
        const url = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketTypes&EventID=${eventID}`;
        const response = await axios.post("http://35.154.231.183:8080/putapi", {
          url,
        });
        const marketId = response?.data?.res[0]?.marketId;

        if (!marketId) {
          socket.emit("fancyData", []); // Send an empty array to indicate no data
          clearInterval(fancyDataInterval);
          return;
        }

        const url1 = `https://nikhilm.xyz/bettingapi/match_odds_v1.php?Action=listMarketBookOdds&MarketID=${marketId}`;
        const response1 = await axios.post(
          "http://35.154.231.183:8080/putapi",
          {
            url: url1,
          }
        );

        // Emit the fetched data to the client
        socket.emit("fancyData", response1.data.res || []);
      } catch (error) {
        console.error("Error fancy data:", error);
      }
    }, 1000);
  });

  // socket.on("startFetchingMatch", (category) => {
  //   console.log(`Client wants to fetch match for : ${category}`);
  //   // Set up an interval to fetch and emit general score data every 3 seconds
  //   generalScoreInterval = setInterval(async () => {
  //     try {
  //       const url = `http://172.105.54.97:8085/api/${category}`;
  //       const response = await axios.post("http://35.154.231.183:8080/putapi", {
  //         url,
  //       });

  //       if (!response.data.res) {
  //         socket.emit("matchData", []); // Send an empty array to indicate no data
  //         clearInterval(generalScoreInterval);
  //         return;
  //       }

  //       // Emit the fetched general score data to the client
  //       socket.emit("matchData", response.data.res || []);
  //     } catch (error) {
  //       console.error("Error fetching general score data:", error);
  //     }
  //   }, 20000);
  // });

  socket.on("startUserNotification", async (data) => {
    console.log(`Client wants to fetch match for : ${data}`);
    // Set up an interval to fetch and emit general score data every 3 seconds
    try {
      const url = `http://172.105.54.97:8085/api/${category}`;
      const notification = await axios.post(
        "http://35.154.231.183:8080/putapi",
        data
      );

      // promotion
      // deposit
      // withdraw

      // Emit the fetched general score data to the client
      socket.emit("userNotification", response.data || {});
    } catch (error) {
      console.error("Error fetching general notification data:", error);
    }
  });

  // user to admin withdraw / deposit transaction notifications
  socket.on("startAdminTransaction", async (data, type) => {
    console.log(`Client wants to fetch match for : ${data}`);
    // Set up an interval to fetch and emit general score data every 3 seconds
    
      // const url = `http://172.105.54.97:8085/api/${category}`;
      // const notification = await axios.post(
      //   "http://35.154.231.183:8080/putapi",
      //   data
      // );

      //
      console.log(data, type);
      // promotion
      // deposit
      // withdraw

      // Emit the fetched general score data to the client
      socket.emit("adminTransaction", response.data || {});

  });

  // admin to user withdraw / deposit transaction notifications
  socket.on("startUserTransaction", async (data) => {
    console.log(`Client wants to fetch match for : ${data}`);
    // Set up an interval to fetch and emit general score data every 3 seconds
    try {
      const url = `http://172.105.54.97:8085/api/${category}`;
      const notification = await axios.post(
        "http://35.154.231.183:8080/putapi",
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
  });
});

// http://172.105.54.97:8085/api/getScoreData?eventid=32484271

// http://172.105.54.97:8085/api/cricketscoreballyball?id=32527170

// http://172.105.54.97:8085/api/cricket

// http://172.105.54.97:8085/api/tennis

// http://172.105.54.97:8085/api/socker

// http://172.105.54.97:8085/api/getOdds?eventId=1808132247
