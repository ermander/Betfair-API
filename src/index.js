const Betfair = require('betfair-api-node');
const sleep = require('./Utils/sleep.js');

const main = async () => {
  try {
    const betfair = new Betfair(
      'XAl3yHNF9KCFr2TI',
      'ilmiosuccesso@gmail.com',
      'pascal18',
      false
    );
    await sleep(5000);
    console.log(betfair);
    // Getting full list of soccer events
    let events = await betfair.listEvents({ eventTypeIds: ['1'] });

    events = events.filter(
      (event) =>
        event.event.name === 'Salernitana - Lazio' ||
        event.event.name === 'Central Coast Mariners - Newcastle Jets'
    );

    // Getting all the market avaiable for the event
    for (let i = 0; i < events.length; i++) {
      events[i].markets = await betfair.listMarketCatalogue(
        {
          eventIds: [events[i].event.id]
        },
        1000
      );
      events[i].markets = events[i].markets.filter(
        (market) =>
          market.marketName === 'Esito Finale' ||
          market.marketName === 'Under/Over 2,5 gol' ||
          market.marketName === 'Entrambe le Squadre Segnano'
      );
      events[i].goalNoGoalOdds = await betfair.listMarketBook([]);
    }
    console.log(events[0]);
    const marketBook = await betfair.listMarketBook(
      [events[0].markets[0].marketId],
      {
        priceProjection: {
          priceData: ['EX_BEST_OFFERS']
        }
      }
    );
    console.log(marketBook);
    console.log(marketBook[0].runners[0].ex);
    console.log(marketBook[0].runners[1].ex);
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
};

main();
