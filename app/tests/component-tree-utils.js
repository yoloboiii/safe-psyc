// @flow

import React from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import prettyFormat from 'pretty-format';
import util from 'util';

const {ReactElement, ReactTestComponent} = prettyFormat.plugins;

export function findChildren(root: React.Component<*, *>, childType: Function): Array<React.Component<*,*>> {
    return getChildrenAndParent(root)
        .filter(c => {
            // $FlowFixMe
            const correctType = c && c.type === childType;
            return correctType;
        });
}

export function findParent(child: React.Component<*,*>, parentType: Function): ?React.Component<*,*> {

    while (child.parent !== undefined) {
        // $FlowFixMe
        if (child.parent.type === parentType) {
            // $FlowFixMe
            return child.parent;
        } else {
            // $FlowFixMe
            child = child.parent;
        }
    }
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

    children.forEach(c => {
        if (c) c.parent = component
    });
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
                        child.parent = component;
                        // $FlowFixMe
                        unvisited.push(child);
                    }
                }
            } else {
                // $FlowFixMe
                component.rendered.parent = component;
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
