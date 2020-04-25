import { has } from 'lodash/object';
import { isArray } from 'lodash/lang';

const nodeSvgShape = {
    shape: 'circle',
    shapeProps: {
      fill: '#1ABB9C',
      r: 10,
    },
  };

const mapFactToChildren = (fact) => {
    if (has(fact, 'fact') && has(fact, 'operator') && has(fact, 'value')) {
        return ({name: fact.fact, attributes: {
            [fact.operator] : fact.value
        }})
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
            return { node: mapConditionsToChildren(condition.conditions, 1), depthCount, index: condition.index };
        });
    } 
    return { node: mapConditionsToChildren(conditions.conditions, 1), depthCount, index: 0 };
};

const mapChildNodeToFacts = (children) => {
    const fact = { fact: children.name };
    Object.keys(children.attributes).forEach((key) => {
        fact['operator'] = key;
        fact['value'] = children.attributes[key];
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


export const transformTreeToRule = (node = {}, outcome) => {
    return ({conditions: mapNodeToCondition(node), event: { type: outcome.value }});
}