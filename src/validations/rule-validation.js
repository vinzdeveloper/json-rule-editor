import { Engine } from 'json-rules-engine';

export const processEngine = (fact, conditions) => {
	const engine = new Engine(conditions);

	return engine
		.run(fact)
		.then((results) => {
			// console.log('results', results);
			return results.events;
		})
		.catch((e) => {
			console.error('Problem occured when processing the rules', e);
			return Promise.reject({ error: e.message });
		});
};

export const validateRuleset = async (facts, conditions) => {
	let result;
	try {
		result = await processEngine(facts, conditions);
		// console.log('result', result);
	} catch (err) {
		// console.log('err', err);
	}
	return result;
};
