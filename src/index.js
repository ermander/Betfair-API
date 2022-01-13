const Betfair = require('betfair-api-node');

const main = async () => {
  try {
    const betfair = new Betfair(
      'XAl3yHNF9KCFr2TI',
      'ilmiosuccesso@gmail.com',
      'pascal18',
      true
    );
    await betfair.login();
    // Getting full list of soccer events
    let events = await betfair.listEvents({ eventTypeIds: ['1'] });

    events = events.filter(
      (event) =>
        event.event.name === 'Salernitana - Lazio' ||
        event.event.name === 'Central Coast Mariners - Newcastle Jets'
    );

    // For every event we get the avaiable markets (market catalogue)
    for (let i = 0; i < events.length; i++) {
      events[i].markets = await betfair.listMarketCatalogue(
        {
          eventIds: [events[i].event.id]
        },
        1000
      );
      // Filtering the market by keeping just those who are needed
      events[i].markets = events[i].markets.filter(
        (market) =>
          market.marketName === 'Esito Finale' ||
          market.marketName === 'Under/Over 2,5 gol' ||
          market.marketName === 'Entrambe le Squadre Segnano'
      );

      // Getting all the back and lay data
      for (let j = 0; j < events[i].markets.length; j++) {
        // Esito finale
        const objectValues = Object.values(events[i].markets[j]);

        if (objectValues.length === 3 && objectValues[1] === 'Esito Finale') {
          const oneXTwoOdds = await betfair.listMarketBook(
            [events[i].markets[j].marketId],
            {
              priceProjection: {
                priceData: ['EX_BEST_OFFERS']
              }
            }
          );
          events[i].oneXTwoOdds = oneXTwoOdds;
        }
        // Under/Over 2,5 goal
        if (
          objectValues.length === 3 &&
          objectValues[1] === 'Under/Over 2,5 gol'
        ) {
          const underOverOdds = await betfair.listMarketBook(
            [events[i].markets[j].marketId],
            {
              priceProjection: {
                priceData: ['EX_BEST_OFFERS']
              }
            }
          );
          events[i].underOverOdds = underOverOdds;
        }

        // Goal/NoGoal odds
        if (
          objectValues.length === 3 &&
          objectValues[1] === 'Entrambe le Squadre Segnano'
        ) {
          const goalNoGoalOdds = await betfair.listMarketBook(
            [events[i].markets[j].marketId],
            {
              priceProjection: {
                priceData: ['EX_BEST_OFFERS']
              }
            }
          );
          events[i].goalNoGoalOdds = goalNoGoalOdds;
        }
      }
    }

    const eventsData = [];
    for (let event of events) {
      const eventData = {
        home: event.event.name.split(' - ')[0],
        away: event.event.name.split(' - ')[1],
        date: event.event.openDate,
        oneOdds: event.oneXTwoOdds[0].runners[0].ex,
        twoOdds: event.oneXTwoOdds[0].runners[1].ex,
        xOdds: event.oneXTwoOdds[0].runners[2].ex,
        underOdds: event.underOverOdds[0].runners[0].ex,
        overOdds: event.underOverOdds[0].runners[1].ex,
        goalOdds: event.goalNoGoalOdds[0].runners[0].ex,
        noGoalOdds: event.goalNoGoalOdds[0].runners[1].ex
      };

      eventsData.push(eventData);
    }

    console.log(eventsData);
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
};

main();
