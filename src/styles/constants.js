// @flow

function space(multiplier: number = 1): number {
    return multiplier * 10;
};
const flex1 = {
    flex: 1,
};
const padding = {
    padding: space(),
};
const defaultTextColor = '#666';
const lightTextColor = '#CCC';
const defaultFontFamily = 'Lato';
export const constants = {
    space,

    // https://coolors.co/33658a-86bbd8-ffc145-698e30-ff5151
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
    },
    normalText: {
        fontSize: 16,
        fontFamily: defaultFontFamily,
        color: defaultTextColor,
        lineHeight: 16 * 1.5,
    },
    largeText: {
        fontSize: 22,
        fontFamily: defaultFontFamily,
        color: defaultTextColor,
    },

    flex1,
    padding,
    padflex: {
        ...flex1,
        ...padding,
    },

    mediumRadius: space(2),
};
