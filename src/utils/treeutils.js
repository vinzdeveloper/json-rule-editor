import { findIndex } from 'lodash/array';

const mapNodeName = (node) =>
    ({ name: node.name, depth: node.depth, id: node.id });

const getNodeIndex = (parentNode, childNode) => {
    if (parentNode && parentNode.children && parentNode.children.length > 0) {
        return findIndex(parentNode.children, { 'id': childNode.id });
    }
    return undefined;
}

export const getNodeDepthDetails = (node, result = []) => {
    const obj = mapNodeName(node);
    // eslint-disable-next-line no-constant-condition
    while(true) {
        if(node.depth > 0) {
            const index = getNodeIndex(node.parent, obj);
            obj['index'] = index;
            result.push(obj);
            return getNodeDepthDetails(node.parent, result);
        }
        break;
    }
    return result;
}

const iterateNode = (node, depth) => {

    if (node.children && node.children.length > 0) {
        depth = depth + 1;
        node.children.forEach(childNode => {
            depth = iterateNode(childNode, depth);
        })
       
    }
    return depth;
}

export const getNodeDepth = node => iterateNode(node, 0);