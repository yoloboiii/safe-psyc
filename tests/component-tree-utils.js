// @flow

import React from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import prettyFormat from 'pretty-format';

const {ReactElement, ReactTestComponent} = prettyFormat.plugins;

export function findChildren(root: React.Component<*, *>, childType: Function|string): Array<React.Component<*,*>> {
    return getChildrenAndParent(root)
        .filter(c => {
            let correctType = false;
            if (c && c.type) {
                if (typeof(childType) === 'string') {

                    if (c.type.name) {
                        correctType = c.type.name === childType;
                    } else if (c.type.displayName) {
                        correctType = c.type.displayName === childType;
                    } else {
                        correctType = c.type === childType;
                    }
                } else {
                    correctType = c.type === childType;
                }
            }

            return correctType;
        });
}

export function findFirstChild(root: React.Component<*, *>, childType: Function|string): React.Component<*, *> {
    const children = findChildren(root, childType);
    if (children.length === 0) {
        const name = typeof(childType) === 'function'
            ? childType.name
            : childType;

        throw new Error("Did not find any children matching " + name);
    } else {
        return children[0];
    }
}

export function findAllByTestId(root: React.Component<*,*>, testId: string): Array<React.Component<*,*>> {
    return getChildrenAndParent(root)
        .filter(c => c.props && c.props.testID === testId);
}

export function stringifyComponent(component: React.Component<*,*>): string {
    if (isShallowRendered(component)) {
        return reactElementToJSXString(component);
    } else if (component.toJSON) {
        // $FlowFixMe
        return stringifyComponent(component.toJSON());
    } else {
        return prettyFormat(component, {
            plugins: [ReactTestComponent],
            printFunctionName: false,
            maxDepth: 5,
        });
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
    return component.hasOwnProperty('_owner');
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
    return [parent].concat(getChildren_ShallowRenderer(parent));
}

function getChildren_ShallowRenderer(component: React.Component<*,*>) {
    if (!component || !component.props || !component.props.children) {
        return [];
    }

    let children = component.props.children;
    if (!Array.isArray(children)) {
        children = [children];
    }

    const grandchildren = children.map(c => getChildren_ShallowRenderer(c));
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
                    if (child) {
                        // $FlowFixMe
                        unvisited.push(child);
                    }
                }
            } else {
                // $FlowFixMe
                unvisited.push(component.rendered);
            }
        }
    }
}

export function getAllRenderedStrings(component: React.Component<*,*>): Array<string> {
    const strings = getChildrenAndParent(component)
        .filter(node => {
            return typeof node === 'string';
        });

    return ((strings: any): Array<string>);
}

