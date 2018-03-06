// @flow

import React from 'react';
import { View, FlatList } from 'react-native';

type Props<T> = {
    items: Array<T>,
    itemsPerRow: number,
    renderItem: T => React$Element<*>,
    keyExtractor: (Array<T>) => *,
};

export function SquareGrid<T>(props: Props<T>) {
    const data = groupBy(props.items, props.itemsPerRow);

    let i = 0;
    return (
        <FlatList
            data={data}
            keyExtractor={props.keyExtractor }
            renderItem={datum => {
                const items = datum.item;
                return <Row
                    items={items}
                    renderItem={props.renderItem}
                    itemsPerRow={props.itemsPerRow}
                />;
            }}
        />
    );
}
SquareGrid.defaultProps = {
    keyExtractor: (item, index) => index,
    itemsPerRow: 2,
};

function groupBy(items, num) {
  const groups = [];
  let buf = [];

  for (const item of items) {
    buf.push(item);

    if (buf.length === num) {
      groups.push(buf);
      buf = [];
    }
  }
  if (buf.length !== 0) {
    groups.push(buf);
  }

  return groups;
}

function Row(rowProps) {
    const { items, renderItem, itemsPerRow } = rowProps;
    const renderedCells = items.map(i => renderItem(i));

    while (renderedCells.length < itemsPerRow) {
        renderedCells.push(<View
            key={'empty' + renderedCells.length}
            style={styles.emptyCell}
        />);
    }


    return (
        <View style={styles.row}>
            { renderedCells }
        </View>
    );
}

const styles = {
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptyCell: {
        flex: 1,
    },
};
