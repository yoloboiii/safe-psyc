// @flow

import React from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import util from 'util';

export function findChildren(root: React.Component<*, *>, childType: Function): Array<React.Component<*,*>> {
    return getChildrenAndParent(root)
        .filter(c => {
            // $FlowFixMe
            const correctType = c && c.type === childType;
            return correctType;
        });
}

export function stringifyComponent(component: React.Component<*,*>): string {
    if (isShallowRendered(component)) {
        return reactElementToJSXString(component);
    } else if (component.toTree) {
        // $FlowFixMe
        return stringifyComponent(component.toTree());
    } else {
        return util.inspect(component, { depth: 5 });
    }
}

export function getChildrenAndParent(parent: React.Component<*,*>): Array<React.Component<*,*>> {
    const isShallow = isShallowRendered(parent);
    if(isShallow) {
        return getChildrenAndParent_ShallowRenderer(parent);
    } else {
        return getChildrenAndParent_TestRenderer(parent);
    }
}


function isShallowRendered(component) {
    // $FlowFixMe
    return component['$$typeof'] !== undefined;
}

function getChildrenAndParent_TestRenderer(parent) {
    const comps = [];

    const tree = parent.toTree
        // $FlowFixMe
        ? parent.toTree()
        : parent;
    visitComponentTree(tree, c => comps.push(c));

    return comps;
}

function getChildrenAndParent_ShallowRenderer(parent) {
    return [parent].concat(getChildren(parent));
}

function getChildren(component: React.Component<*,*>) {
    if (!component || !component.props || !component.props.children) {
        return [];
    }

    let children = component.props.children;
    if (!Array.isArray(children)) {
        children = [children];
    }

    const grandchildren = children.map(c => getChildren(c));
    const flattenedGrandChildren = [].concat.apply([], grandchildren);
    return children.concat(flattenedGrandChildren);
}
export function visitComponentTree(root: React.Component<*,*>, visitor: (React.Component<*,*>)=>mixed){

    const unvisited: Array<React.Component<*,*>> = [root];
    while (unvisited.length > 0) {
        const component = unvisited.pop();
        if (!component) {
            console.log('Tried to visit undefined component');
            continue;
        }

        visitor(component);

        if (component.rendered) {
            if (Array.isArray(component.rendered)) {
                for (const child of component.rendered) {
                    // $FlowFixMe
                    unvisited.push(child);
                }
            } else {
                // $FlowFixMe
                unvisited.push(component.rendered);
            }
        }
    }
}

