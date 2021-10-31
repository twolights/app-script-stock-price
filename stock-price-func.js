// 支援興櫃/上櫃股票
// Requires plugin: Cheerio
// =IF(ISBLANK(A20), "", IF(ISBLANK(TW_STOCK(B20, A20)), GOOGLEFINANCE(B20 & ":" & A20, "price"), TW_STOCK(B20, A20)))

const TW_ALL = 'TW.ALL';

function getTaiwanStockPrice(ticker) {
    const url = 'https://histock.tw/stock/' + ticker
    const raw = UrlFetchApp.fetch(url).getContentText();
    const $ = Cheerio.load(raw);
    const content = $('#Price1_lbTPrice span').text();
    if(content.length == 0) {
        return 0;
    }
    return parseFloat(content);
}

/**
 * Get Taiwan stock price
 *
 * @param {string} market - Market
 * @param {string} ticker - Ticker
 * @return Stock price
 * @customfunction
 */
function TW_STOCK(market, ticker) {
    if(market == TW_ALL) {
        return getTaiwanStockPrice(ticker);
    }
    return null;
}

function parseStockOptionsCode(code) {
    let dateIndex = code.search(/[0-9]/),
        callPutIndex = dateIndex + 6,
        priceIndex = callPutIndex + 1;
    let ticker = code.substring(0, dateIndex),
        dateString = code.substring(dateIndex, callPutIndex),
        callPut = code.substring(callPutIndex, priceIndex),
        priceString = code.substring(priceIndex);
    dateString = '20' + dateString;
    let year = parseInt(dateString.substr(0, 4)),
        month = parseInt(dateString.substr(4, 2)),
        day = parseInt(dateString.substr(6));
    let date = new Date(Date.UTC(year, month - 1, day));
    return {
        'ticker': ticker,
        'type': callPut,
        'date': dateString,
        'timestamp': date.getTime() / 1000,
        'price': parseInt(priceString) / 1000,
    };
}

function US_OPTION(ticker) {
    const referer = 'https://finance.yahoo.com/quote/' + ticker,
          headers = { 'Referer': referer },
          options = { 'headers': headers };
    const URL = 'https://query1.finance.yahoo.com/v8/finance/chart/' + ticker +
        '?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance';
    const response = UrlFetchApp.fetch(URL).getContentText();
    const data = JSON.parse(response);
    const price = data['chart']['result'][0]['meta']['regularMarketPrice'];
    return price * 100;  // Per contract
}

function test() {
    Logger.log(TW_STOCK(TW_ALL, '5346'));
    Logger.log(TW_STOCK(TW_ALL, '6770'));
    Logger.log(US_OPTION('AMD220121C00085000'))
}  
