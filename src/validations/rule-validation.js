import { Engine } from 'json-rules-engine';

export const processEngine = (fact, conditions) => {
	// console.log('fact', fact);
	// console.log('conditions', conditions);
	const engine = new Engine(conditions, { allowUndefinedFacts: true });

	return engine
		.run(fact)
		.then((results) => {
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
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log('err', err);
	}
	return result;
};
