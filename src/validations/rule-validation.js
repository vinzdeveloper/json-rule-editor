import { Engine } from 'json-rules-engine';


const conditions1 = [{"conditions": {
  "all": [{
          "fact": "rooms",
          "operator": "contains",
          "value": 1
      },
      {
          "fact": "bathroom",
          "operator": "equal",
          "value": 1
      }]
    },
      "event": {
        "type": "£500"
    }
  }];
  

export const processEngine = (fact, conditions) => {
  const fact1 = {rooms: [1,2], bathroom: 1}
    const engine = new Engine(conditions);
  
    return engine.run(fact)
        .then(results => {
          console.log(results.events);
          return results.events
        })
        .catch(() => {
          console.error('Problem occured when processing the rules');
        });
};
  
export const validateRuleset = async (facts, conditions) => {
    const result = await processEngine(facts, conditions);
    return result;
}