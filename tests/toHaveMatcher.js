// @flow

import reactElementToJSXString from 'react-element-to-jsx-string';
import { Component } from 'react';
import { getChildrenAndParent, findChildren } from './utils.js';

expect.extend({
    toHaveChild: function (received, childConstructor) {

        const matchingChildren = findChildren(received, childConstructor);
        const message = () => 'Could not find ' + childConstructor.name + ' in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },

    toHaveChildMatching: function (received, childPredicate) {
        const components = getChildrenAndParent(received);

        const matchingChildren = components.filter(childPredicate);

        const message = () => 'Could not find a child matching the predicate in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },

    toHaveChildWithProps: function (received, childConstructor, childProps) {
        const equals = this.equals;

        const components = getChildrenAndParent(received);
        const childProps_happyFlow = childProps;

        const matchingChildren = components.filter(c => {
            // $FlowFixMe
            const correctType = c && c.type === childConstructor;

            if (correctType && childProps_happyFlow) {
                const correctProps = Object.keys(childProps_happyFlow).every(
                    key =>
                        // $FlowFixMe
                        c.props.hasOwnProperty(key) &&
                        // $FlowFixMe
                        equals(c.props[key], childProps_happyFlow[key])
                    );
                return correctType && correctProps;
            }
            return correctType;
        });


        let propsMessage = '';
        if (childProps) {
            propsMessage = ' with props ' + JSON.stringify(childProps, null, 2);
        }
        const message = () => 'Could not find ' + childConstructor.name + propsMessage + ' in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },
});

