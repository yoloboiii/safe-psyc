// @flow

import { TouchableOpacity } from 'react-native';
import { Link } from './Link.js';
import { render } from '../../../tests/render-utils.js';
import { getAllRenderedStrings, getChildrenAndParent } from '../../../tests/component-tree-utils.js';

const defaultProps = {
    prefix: 'foo',
    linkText: 'bar',
    onLinkPress: jest.fn(),
    postFix: 'baz',
};

it('renders prefix, link text and postfix', () => {
    const component = render(
        Link,
        {
            prefix: 'foo',
            linkText: 'bar',
            postfix: 'baz',
        },
        defaultProps
    );

    const s = getAllRenderedStrings(component).sort();
    expect(s).toEqual(expect.arrayContaining(['foo', 'bar', 'baz'].sort()));
});

it('contains a touchable thing', () => {
    const component = render(Link, {}, defaultProps);

    expect(component).toHaveChildMatching(c => {
        if (c.props) {
            return !!c.props.onPress;
        } else {
            return false;
        }
    });
});

it('The touchable thing invokes the callback on press', () => {
    const onLinkPressMock = jest.fn();
    const linkText = 'bar';

    const component = render(
        Link,
        {
            linkText,
            onLinkPress: onLinkPressMock,
        },
        defaultProps
    );

    const touchable = getChildrenAndParent(component).filter(c => {
        const isPressable = c.props && c.props.onPress;
        const strings = getAllRenderedStrings(c);
        const isLinkText = strings[0] === linkText;

        return isLinkText && isPressable;
    })[0];

    expect(onLinkPressMock).not.toHaveBeenCalled();
    touchable.props.onPress();
    expect(onLinkPressMock).toHaveBeenCalledTimes(1);
});
