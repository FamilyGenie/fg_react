import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from 'react-sidebar';
import MaterialTitlePanel from './material_title_panel';
import SidebarContent from './sidebar_content';

export default class HistoryBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      docked: true,
      transitions: true,
      touch: true,
      shadow: true,
      pullRight: true,
      touchHandleWidth: 20,
      dragToggleDistance: 30,
    }
  }

toggleHistory = () => {
  this.setState({
    docked: !this.state.docked,
  })
}

  render() {
    const sidebar = <SidebarContent />;

    const styles = {
      contentHeaderMenuLink: {
        textDecoration: 'none',
        color: 'white',
        padding: 8,
      },
      content: {
        padding: '16px',
      },
      button: {
        top: 0,
        right: 0,
        position: "fixed",
        zIndex: 1,
      }
    };
    const contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.menuButtonClick} href="#" style={styles.contentHeaderMenuLink}>=</a>}
        <span> React Sidebar</span>
      </span>);

    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      sidebarClassName: 'custom-sidebar-class',
      touch: this.state.touch,
      shadow: this.state.shadow,
      pullRight: this.state.pullRight,
      touchHandleWidth: this.state.touchHandleWidth,
      dragToggleDistance: this.state.dragToggleDistance,
      transitions: this.state.transitions,
      onSetOpen: this.onSetOpen,
    };

    return (
      <Sidebar {...sidebarProps}>
        <button style={styles.button}
            onClick={this.toggleHistory}>Toggle
        </button>
      </Sidebar>
    );
  }
}
