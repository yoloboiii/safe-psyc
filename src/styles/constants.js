// @flow

const space = 10;
const flex1 = {
    flex: 1,
};
const padding = {
    padding: space,
};
const defaultTextColor = '#666';
const lightTextColor = '#CCC';
export const constants = {
    space,

    // https://coolors.co/33658a-86bbd8-ffc145-698e30-ff5151
    primaryColor: '#fdb807',
    positiveColor: '#2dde98',
    negativeColor: '#ff4f81',
    hilightColor1: '#1cc7d0',
    hilightColor2: '#00aeff',

    notReallyWhite: '#FAFAFF',
    defaultTextColor,
    lightTextColor,

    smallText: {
        fontSize: 12,
        color: defaultTextColor,
    },
    normalText: {
        fontSize: 16,
        color: defaultTextColor,
    },
    largeText: {
        fontSize: 22,
        color: defaultTextColor,
    },

    flex1,
    padding,
    padflex: {
        ...flex1,
        ...padding,
    },

    mediumRadius: 2 * space,
};
