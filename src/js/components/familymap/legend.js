import React from 'react';

export default class Legend extends React.Component {

  render = () => {

    return (
      <div class="legendDiv">
        <div class="help-header">
          <h3 class="history-title-1">Legend</h3>
        </div>
        <div class="buffer-div">
        </div>
        <div class="legends">
          <div class="legendContent">
            <h3 class="legendHeader">Parent-Child</h3>
            <div class="bufferLegend">
            </div>
            <div class="legendBox">
              <div class="legendInfo">
                <h4 class="legendType">Biological</h4>
                <p class="legendType underLine">___________</p>
              </div>
              <div class="legendInfo">
                <h4 class="legendType">Step</h4>
                <p class="legendType">-- -- -- -- -- --</p>
              </div>
              <div class="legendInfo">
                <h4 class="legendType">Adopted</h4>
                <p class="legendType">- - - - - - - - -</p>
              </div>
              <div class="legendInfo">
                <h4 class="legendType">Foster</h4>
                <p class="legendType">. . . . . . . . . . . . . .</p>
              </div>
              <div class="legendInfo">
                <h4 class="legendType">Legal</h4>
                <p class="legendType">""""""""""""""""""</p>
              </div>
              <div class="legendInfo">
                <h4 class="legendType">Attractive</h4>
                <p class="legendType">^^^^^^^^^^^^</p>
              </div>
            </div>
          </div>
          <div class="legendContent">
            <h3 class="legendHeader">Pair Bonds</h3>
            <div class="bufferLegend">
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Marriage</h4>
              <p class="legendType underLine">___________</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Undefined</h4>
              <p class="legendType">??????????????</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Mated</h4>
              <p class="legendType">- - - - - - - - - -</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Casual</h4>
              <p class="legendType">0-0-0-0-0-0</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Stranger</h4>
              <p class="legendType">ooooooooooo</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Extra-Marital</h4>
              <p class="legendType">***************</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Coercive</h4>
              <p class="legendType">->->->->->->->-</p>
            </div>
            <div class="legendInfo">
              <h4 class="legendType">Restitution</h4>
              <p class="legendType">$$$$$$$$$$$</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
