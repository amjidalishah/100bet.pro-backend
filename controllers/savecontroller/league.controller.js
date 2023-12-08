const { default: axios } = require("axios");
const LeagueModel = require("../../models/league.model");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");

const fetchCompetitionData = async (url) => {
  try {
    const response = await axios.post("http://3.108.170.225:8080/putapi", {
      url,
    });
    return response?.data?.res?.data?.t1 || response?.data?.res || [];
  } catch (error) {
    console.error("Error fetching competition data:", error.message);
    return [];
  }
};

const updateOrInsertLeague = async (leagueData) => {
  try {
    const existingLeague = await LeagueModel.findOne({
      league_id: leagueData.league_id,
    });

    if (existingLeague) {
      // Update the existing league
      await LeagueModel.updateOne(
        { league_id: leagueData.league_id },
        {
          $set: {
            name: leagueData.name,
            market_count: leagueData.market_count,
            status:true,
            competition_region: leagueData.competition_region,
            updated_at: GetCurrentTime(),
          },
        }
      );
    } else {
      // Insert a new league
      await LeagueModel.create({
        league_id: leagueData.league_id,
        sport_id: leagueData.sport_id,
        name: leagueData.name,
        market_count: leagueData.market_count,
        competition_region: leagueData.competition_region,
        status: true,
        created_at: GetCurrentTime(),
        updated_at: GetCurrentTime(),
      });
    }
    console.log(`League with ID ${leagueData.league_id} processed.`);
  } catch (error) {
    console.error("Error updating or inserting league data:", error.message);
  }
};

const saveLeague = async () => {
  const urlCricket = "http://172.105.54.97:8085/api/getCompetitions?id=4";

  const urlTennis = "http://172.105.54.97:8085/api/tennis";

  const urlSoccer = "http://172.105.54.97:8085/api/socker";

  const response1 = (await fetchCompetitionData(urlCricket)) || [];
  const response2 = (await fetchCompetitionData(urlSoccer)) || [];
  const response3 = (await fetchCompetitionData(urlTennis)) || [];

  const sportMappings = {
    1: "1", // Replace with your actual sport IDs
    2: "2",
    4: "4",
  };

  //   console.log(response1, "1");
  console.log(response2, "2");
  //   console.log(response3, "3");

  // Process and insert/update data for soccer, tennis, and cricket
  for (const item of response1) {
    item.league_id = item.competition.id;
    item.sport_id = sportMappings[4];
    item.status = true;
    item.name = item.competition.name;
    item.market_count = item.marketCount;
    item.competition_region = item.competitionRegion;
    item.created_at = GetCurrentTime();
    item.updated_at = GetCurrentTime();
    await updateOrInsertLeague(item); // Await the database operation
  }

  for (const item of response2) {
    item.league_id = item.cid;
    item.sport_id = sportMappings[1];
    item.status = true;
    item.name = item.cname;
    item.market_count = item.m;
    item.competition_region = item.gtype;
    item.created_at = GetCurrentTime();
    item.updated_at = GetCurrentTime();
    await updateOrInsertLeague(item); // Await the database operation
  }

  for (const item of response3) {
    item.league_id = item.cid;
    item.sport_id = sportMappings[2];
    item.status = true;
    item.name = item.cname;
    item.market_count = item.m;
    item.competition_region = item.gtype;
    item.created_at = GetCurrentTime();
    item.updated_at = GetCurrentTime();
    await updateOrInsertLeague(item); // Await the database operation
  }

  console.log("done");
};
module.exports = { saveLeague };

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
