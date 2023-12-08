const { default: axios } = require("axios");
const LeagueModel = require("../../models/league.model");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");
const MatchModel = require("../../models/match.model");
const { FormatDate } = require("../../utils/FormatDataFor");

const SaveMatch = async () => {
  const Leagues = await LeagueModel.find();
  for (const league of Leagues) {
    if (league.sport_id == "4") {
      const url = `http://172.105.54.97:8085/api/getEvents?sid=${league.league_id}&sportid=4`;
      const response = await axios.post("http://3.108.170.225:8080/putapi", {
        url,
      });
      let league_name = league.name;
      let league_id = league.league_id;
      let sport_id = league.sport_id;
      let matches = response?.data?.res || [];
      // console.log(league)
      for (const match of matches) {
        updateOrCreateMatches(match, league_id, sport_id, league_name);
      }
    } else if (league.sport_id == 1) {
      const url = `http://172.105.54.97:8085/api/socker`;
      const response = await axios.post("http://3.108.170.225:8080/putapi", {
        url,
      });
      let matches = response?.data?.res?.data?.t1 || [];
      for (const match of matches) {
        updateOrCreateMatchesForTennisAndSoccer(match);
      }
    } else {
      const url = `http://172.105.54.97:8085/api/tennis`;
      const response = await axios.post("http://3.108.170.225:8080/putapi", {
        url,
      });
      let matches = response?.data?.res?.data?.t1 || [];
      for (const match of matches) {
        updateOrCreateMatchesForTennisAndSoccer(match);
      }
    }
  }
  console.log("Done");
};

// for cricket
const updateOrCreateMatches = async (
  match,
  league_id,
  sport_id,
  league_name
) => {
  let sport_name =
    sport_id == "4" ? "cricket" : sport_id == "1" ? "soccer" : "tennis";

  try {
    const existingMatch = await MatchModel.findOne({
      match_id: match.event.id,
      league_id: league_id,
    });
    if (existingMatch) {
      // Update the existing match
      const date = FormatDate(match.event.openDate);
      console.log(date);
      await MatchModel.updateOne(
        { match_id: match.event.id },
        {
          $set: {
            sport_id: sport_id,
            league_id: league_id,
            match_id: match.event.id,
            name: match.event.name,
            league_name: league_name,
            updated_at: GetCurrentTime(),
            open_date: date,
            country_code: match.event.countryCode,
            undeclared_markets: match.undeclared_markets,
          },
        }
      );
    } else {
      // Create a new match
      await MatchModel.create({
        sport_id: sport_id,
        league_id: league_id,
        match_id: match.event.id,
        match_name: match.event.name,
        sport_name: sport_name,
        league_name: league_name,
        odds: false,
        bookmaker: false,
        status: true,
        fancy: true,
        toss: true,
        team: "",
        result: "pending",
        created_at: GetCurrentTime(),
        updated_at: GetCurrentTime(),
        open_date: FormatDate(match.event.openDate),
        country_code: match.event.countryCode,
        undeclared_markets: match.undeclared_markets,
      });
    }
    console.log(`Match with ID cricket ${match.event.id} processed.`);
  } catch (error) {
    console.error(`Error updating or creating matches: ${error.message}`);
  }
};

const updateOrCreateMatchesForTennisAndSoccer = async (match) => {
  let sport_name =
    match.etid == "4" ? "cricket" : match.etid == "1" ? "soccer" : "tennis";

  try {
    const existingMatch = await MatchModel.findOne({
      match_id: match.gmid,
      league_id: match.cid,
    });

    if (existingMatch) {
      // Update the existing match
      await MatchModel.updateOne(
        { match_id: match.gmid },
        {
          $set: {
            sport_id: match.etid,
            league_id: match.cid,
            match_id: match.gmid,
            match_name: match.ename.replace(/-|or|vs/g, "v"),
            league_name: match.cname,
            updated_at: GetCurrentTime(),
            open_date: match.stime,
            undeclared_markets: match.rc,
          },
        }
      );
    } else {
      // Create a new match
      await MatchModel.create({
        sport_id: match.etid,
        league_id: match.cid,
        match_id: match.gmid,
        match_name: match.ename.replace(/-|or|vs/g, "v"),
        sport_name: sport_name,
        league_name: match.cname,
        odds: false,
        bookmaker: false,
        status: true,
        fancy: false,
        toss: false,
        team: "",
        result: "pending",
        created_at: GetCurrentTime(),
        updated_at: GetCurrentTime(),
        open_date: match.stime,
        country_code: "",
        undeclared_markets: match.rc,
      });
    }
    console.log(`Match with ID ${match.gmid} d processed.`);
  } catch (error) {
    console.error(`Error updating or creating matches: ${error.message}`);
  }
};

module.exports = { SaveMatch };

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
