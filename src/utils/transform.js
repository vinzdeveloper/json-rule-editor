import { has } from 'lodash/object';
import { isArray } from 'lodash/lang';
import { join } from 'lodash/array';

const nodeSvgShape = {
    shape: 'circle',
    shapeProps: {
      fill: '#1ABB9C',
      r: 10,
    },
  };

const mapFactToChildren = (fact) => {
    if (has(fact, 'fact') && has(fact, 'operator') && has(fact, 'value')) {
        let value = fact.value;
        let attributes = {};
        if (isArray(fact.value)) {
            value = join(fact.value, ',');
        }

        attributes[fact.operator] = value;

        if (fact.path) {
            attributes['path'] = fact.path;
        }
        return ({name: fact.fact, attributes});
    }
    return undefined;
};

const mapParentNode = (name) => {
    return ({name, nodeSvgShape, children : []});
};

//global variable to determine the depth
let depthCount;

const mapConditionsToChildren = (condition={}, depth) => {
    const parentNode = has(condition, 'all') ? 'all' : 'any';
    const node = mapParentNode(parentNode);
    const childrenNode = condition[parentNode] && condition[parentNode].map(facts => {
        if (has(facts, 'fact')) {
            return mapFactToChildren(facts);
        } else {
            depthCount = depth > depthCount ? depth : depthCount;
            return mapConditionsToChildren(facts, depth + 1);
        }
    });
    node.children = childrenNode;
    return node;
};

export const transformRuleToTree = (conditions = []) => {
    depthCount = 0;
    if (isArray(conditions)) {
        return conditions.map((condition) => {
            depthCount = 0;
            return { node: mapConditionsToChildren(condition.conditions, 1), depthCount, index: condition.index, event: condition.event };
        });
    } 
    return { node: mapConditionsToChildren(conditions.conditions, 1), depthCount, index: 0, event: conditions.event};
};

const mapChildNodeToFacts = (children) => {
    const fact = { fact: children.name };
    Object.keys(children.attributes).forEach((key) => {
        if (key === 'path') {
            fact['path'] = children.attributes.path;
        } else {
            fact['operator'] = key;
            let value;
            if (String(children.attributes[key]).indexOf(',') > -1) {
                value = children.attributes[key].split(',');
            } else {
                value = children.attributes[key];
            }
            fact['value'] = value;
        }
    });
    return fact;
}

const mapNodeToCondition = (node) => {
    const parentNode = { [node.name]: [] };

    if (node.children && node.children.length > 0) {
        const facts = node.children.map((childNode) => {
            if (childNode.name !== 'all' && childNode.name !== 'any') {
                return mapChildNodeToFacts(childNode);
            } else {
                return mapNodeToCondition(childNode);
            }
        })
        parentNode[node.name] = facts;
    }
    return parentNode;
}


export const transformTreeToRule = (node = {}, outcome, params) => {
    return ({conditions: mapNodeToCondition(node), event: { type: outcome.value, params }});
}