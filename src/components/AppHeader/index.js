import React from 'react';
import PropTypes from 'prop-types';
import styled, {css, keyframes} from 'styled-components';
import Icon from '../Icon';
import MainMenu from '../MainMenu';
import {numberToPixels} from 'Utils/components';

const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

const Logo = styled.div`
  width: 28px;
  height: 28px;
  background: lightskyblue url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAZCAYAAAAiwE4nAAAABGdBTUEAALGPC/xhBQAAA45JREFUSA2N1clvTVEcwHE1zzG1Zp5ETU2IoQSRtIRICBpTEGysJCL8D1ixkdgYowkbixpCwkZIa9HETNOqatUQNUZQU/H9vr4jt+/eJ37Jp/fcc84787nN65Q7RlBUhny8QjVuoQ3R6MrLLBSjAC04g5eIRZdYTntGNx474Y+uw0ZLMQ3N+AhjLLahCPdRhf5YiEr8xn/FZGrtgR2H6EtiM/ZhBpyR6Q3ojRA9SOxFYciIPh15Ugwj02X8ESn8RLocJVgP4xycSTS+8fIatvEoWmC6c3ZG5t2BfM9RZschWkMi6+lvEyeTmEllZ9YzqxFfU1iNCrjca/EWTYiGv42uzt+yXDN0SQYjL1PTwzUGW+FSO4PPsJ55o2EdwzYHwbJY5JqhS+Xm25gd5yMMrjvp5TBMO9Md+AU7eQfzviIWYQahYAqJuZgAy7wCtzESXokDyB65d28XrPcC0zEKXok63MBDpCMsg0uwCaV4irMwXIErWIWr8K4ZXgNn4T65tA6uGF74ItjRBbgyS5FCI1rtcCC2w305gmp8gEuyBJb3wSkY67ARJbCsBo2YDVdiErwujXgAZz4VC3DfDm3AkR6Gow1hp7OQwnk8w0wsRogRJDylz+G+L8q8X+QZ4guJm3Ag4zwInrCkb6R7UI823IExvP3R4W/Iu0eudZ90KG1/Md8+Rtuhjc6Hdycalk2Eq+ByGUmNhbw5lFvXmfjbaNi2fdRb4HK56TsxHiFMu3eVcKm6w0NzBS6fLsN96oFSXIMHqhAhbMe27eOCI/oBN9aTugJWdjmn4x0qMA/9UIsGXM0wbSxDAU7CJfZadMUqONi7OI30KeXZ6Sdq4GgHoAQj4ah8/wYPTFMmzSO9fL14pmDDj+DXaCxScGaP4VXx5NtHukGf2eGXfjeq4NH33ee/4j2FL+GpXYCDaEaHcNpJ4fI6q4pIof8Pva+O9Cxc9pXohkP4hBBep8GIdeihSYohZLp/0bDB43CJ/QftaXTWJxDtjNf0LG0jFrlm6EC+x2q3f0fLyd+WKTvGsyWhnquTOJnETCq7bNn30nat7+xczl8oQhdkh4cpfUiyC3LN0LX3X5D3MHzu8kmvgcf+KGxwCzzNnkQPjOE9HIrY/lnosU8KZ+IptbOH8Lg7mwbYeNhf97MM7mctvDYT4J3dDz9pHSJXh1aysWXwQrtP1ahDUowjsxhenze4BK9JLP4ALJPIcBzKTCAAAAAASUVORK5CYII=) no-repeat center center;
  ${props => props.rotateLogo && css`
    animation: ${rotate360} 1125ms infinite linear;
  `};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  height: ${props => numberToPixels(props.height)};
  background: ${props => props.theme.app.header.background};
  & > div {
    margin: 0 .5em;
  }
`;

Header.defaultProps = {
  height: 40,
};

Header.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

class AppHeader extends React.Component {
  state = {
    showMenu: false,
    rotate: false,
  };

  toggleMenu = showMenu => this.setState(() => ({showMenu}));

  toggleRotate = () => this.setState(({rotate}) => ({rotate: !rotate}));

  render() {
    return (
      <Header>
        <div onClick={() => this.toggleMenu(true)}>
          <Icon type={'menu'} />
        </div>
        <div>
          {this.props.showLogo &&
            <Logo
              onClick={this.toggleRotate}
              rotateLogo={this.state.rotate}
            />}
        </div>
        <MainMenu show={this.state.showMenu} toggleMenu={this.toggleMenu} />
      </Header>
    );
  }
}

AppHeader.propTypes = {
  showLogo: PropTypes.bool,
};

export default AppHeader;
