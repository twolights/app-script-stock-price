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

function test() {
    Logger.log(TW_STOCK(TW_ALL, '5346'));
    Logger.log(TW_STOCK(TW_ALL, '6770'));
}
