import { Engine } from 'json-rules-engine';

export default (facts, condition) => {
  const engine = new Engine(facts);

  return engine.run(condition)
      .then(results => results.events)
      .catch(() => {
        console.error('Problem occured when processing the rules');
      });
};