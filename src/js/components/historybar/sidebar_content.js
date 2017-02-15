import React from 'react';
import MaterialTitlePanel from './material_title_panel';



export default class SidebarContent extends React.Component {
openHistoryBar = () => {
  this.setState({docked: true});
}
closeHistoryBar = () => {
  this.setState({docked: false});
}

render = () => {

  const styles = {
   sidebar: {
     width: 300 + "px",
     height: '100%',
     backgroundColor: "white",
   },
   sidebarLink: {
     display: 'block',
     color: '#757575',
     textDecoration: 'none',
   },
   divider: {
     margin: '8px 0',
     height: 1,
     backgroundColor: '#757575',
   },
   content: {
     height: '100%',
     backgroundColor: 'white',
     width: 300 + "px",
   },
  };

 return (
     <div style={styles.content}>
       <div class="help-div">
         <div id="helpHide">
           <i class="fa fa-plus-square fa-2x button2" aria-hidden="true" onClick={this.openHistoryBar}></i>
         </div>
         <div class="main-history" id="helpHistory">
           <div class="help-menu">
             <div class="help-header">
               <div class="blank-person-header">
               </div>
               <h3 class="history-title-1">Help Menu</h3>
               <div class="help-close">
                 <i class="fa fa-minus-square fa-2x" aria-hidden="true" onClick={this.closeHistoryBar}></i>
               </div>
             </div>
           </div>
           <div class="history-context">
             <h3 class="history-title-2">Your History</h3>
             <div class="histories">
               <div class="history">
               </div>
               <div class="history">
               </div>
               <div class="history">
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
 );
}
}
