

export const sendGevents = (event) => {
    gtag('event', event.name, {
        action: event.narrative,
        pageName: event.pageName || event.name,
      });
};