import { Engine } from 'json-rules-engine';


export const processEngine = (fact, conditions) => {
    const engine = new Engine(conditions);
  
    return engine.run(fact)
        .then(results => {
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