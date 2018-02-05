import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {numberToPixels} from '../../../utils/components';
import config from '../config';
import SelectIcon from '../../SelectIcon';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${numberToPixels(config.cardMargin)};
  height: ${numberToPixels(config.cardHeight)};
  border-left: 7px solid ${props => props.colorbar};
  box-shadow: ${props => props.theme.card.shadow};
  background: ${props => props.color};
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  height: 36px;
  width: 100%;
  color: ${props => props.theme.card.header.color};
  align-items: center;
  & > div.c1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 30px;
    height: 100%;
  }
  & > div.c4 {
    display: flex;
    flex: 1 0 auto;
    justify-content: flex-end;
    font-size: 1.5em;
  }
`;

const Text = styled.div`
  height: 1.5em;
  line-height: 1.5em;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;


const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 1.5em;
  line-height: 1.5em;
  & > div {
    width: 50%;
  }
`;

class Card extends React.Component {
  onContextMenu = event => {
    const {id, item, selectedItems} = this.props;
    this.props.showContextMenu({event, selectedDataRow: {id, item, selectedItems}});
    this.props.selectOnlyItem({item: this.props.item});
  };

  cellClick = () => {
    if (document.getSelection().toString() === '') {
      const {item, rowIndex, columnIndex} = this.props;
      this.props.cellClick({item, rowIndex, columnIndex});
    }
  };

  render() {
    const {cardItem, select} = this.props;
    return (
      <CardWrapper
        color={cardItem.color}
        colorbar={cardItem.c0}
        onClick={this.cellClick}
        onContextMenu={this.onContextMenu}>
        <ContentWrapper>
          <Header>
            <div className="c1">
              <SelectIcon
                tooltip={cardItem.tooltip}
                selected={cardItem.selected}
                iconPath={cardItem.c1}
                rowHeight={30}
                iconSize={18}
                select={select}
              />
            </div>
            <div className="c1">2</div>
            <div className="c1">3</div>
            <div className="c4">{cardItem.c4}</div>
          </Header>
          <Text>{cardItem.c5}</Text>
          <Text>{cardItem.c6}</Text>
          <Text>{cardItem.c7}</Text>
          <Footer>
            <div>{cardItem.c8}</div>
            <div>{cardItem.c9}</div>
          </Footer>
        </ContentWrapper>
      </CardWrapper>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object.isRequired,
  cardItem: PropTypes.object.isRequired,
  select: PropTypes.func,
  selectOnlyItem: PropTypes.func,
  selectedItems: PropTypes.array,
  cellClick: PropTypes.func,
  showContextMenu: PropTypes.func,
  rowIndex: PropTypes.number,
  columnIndex: PropTypes.number,
};

export default Card;
