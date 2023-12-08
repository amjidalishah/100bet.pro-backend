const moment = require("moment/moment");



function ConvertDateFormat(inputDate) {
    const formattedDate = moment(inputDate).format('YYYY-MM-DD hh:mm A');
    const stringWithHyphens = formattedDate.replace(/\//g, '-');
    return stringWithHyphens;
  }
  

function convertData(inputData) {
  const {
    _id,
    UserId,
    Username,
    BetTime,
    EventType,
    CommissionStake,
    TransactionId,
    TransferCode,
    ResultType,
    Amount,
    GameId,
    Status,
    WinLoss,
    ResultTime,
  } = inputData;

  const outputData = {
    _id,
    user_id: UserId,
    username: Username,
    match_id: GameId,
    match_date: BetTime.split("T")[0],
    placed_at: ConvertDateFormat(BetTime),
    event_type: "casino",
    league_id: "",
    match_name: "",
    bet_type: "",
    stake: Amount,
    rate: 0,
    win_loss: WinLoss,
    status: Status,
    runner_name: "",
    bet_category: "",
    league_name: "",
    result_type: ResultType == 0 ? "win" : ResultType == 1 ? "lose" : "",
    transfer_code: TransferCode,
    transaction_id: TransactionId,
    result_time: ConvertDateFormat(ResultTime),
    commission_stake: CommissionStake,
  };

  return outputData;
}

// Map through the array to convert each object

const ConvertStructureToBet = (arrayOfObjects) => {
  const convertedArray = arrayOfObjects.map(convertData);
  return convertedArray;
};

module.exports={ConvertStructureToBet}