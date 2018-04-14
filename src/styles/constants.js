// @flow

function space(multiplier: number = 1): number {
    return multiplier * 10;
};
const flex1 = {
    flex: 1,
};
const padding = {
    paddingHorizontal: space(2),
    paddingVertical: space(1),
};
const defaultTextColor = '#666';
const lightTextColor = '#CCC';
const defaultFontFamily = 'Lato';
export const constants = {
    space,

    primaryColor: '#fdb807',
    positiveColor: '#2dde98',
    negativeColor: '#ff4f81',
    hilightColor1: '#1cc7d0',
    hilightColor2: '#00aeff',
    disabledColor: lightTextColor,

    notReallyWhite: '#FAFAFF',
    defaultTextColor,
    lightTextColor,

    smallText: {
        fontSize: 12,
        fontFamily: defaultFontFamily,
        color: defaultTextColor,
        lineHeight: 12 * 1.5,
    },
    normalText: {
        fontSize: 16,
        fontFamily: defaultFontFamily,
        color: defaultTextColor,
        lineHeight: 16 * 1.5,
    },
    largeText: {
        fontSize: 26,
        fontFamily: defaultFontFamily,
        color: defaultTextColor,
        lineHeight: 26 * 1.5,
    },
    boldWeight: '800',
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: 0, height: 1},
    },

    flex1,
    padding,
    padflex: {
        ...flex1,
        ...padding,
    },

    colApart: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    mediumRadius: space(3),
};
