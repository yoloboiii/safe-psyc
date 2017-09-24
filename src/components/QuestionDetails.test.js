// @flow

import { QuestionDetails } from './QuestionDetails.js';
import { render } from '../../tests/render-utils.js';
import { randomEyeQuestion } from '../../tests/question-utils.js';
import { getAllRenderedStrings } from '../../tests/component-tree-utils.js';
import { Image } from 'react-native';

it('contains the image and answer of an eye question', () => {
    const question = randomEyeQuestion();
    const component = render(QuestionDetails, { question });

    expect(component).toHaveChildWithProps(Image, { source: {uri: question.image }});
    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining([question.answer]));
});
