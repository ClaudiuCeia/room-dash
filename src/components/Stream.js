import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import './Stream.css';

class Stream extends Component {
  state = {
    srcObject: null
  }

  render() {
    let config = {
      file: {
        hlsOptions: {
          debug: true,
        }
      }
    };

    return (
      <ReactPlayer 
        url="http://192.168.0.38:8554/video0/stream.m3u8" 
        playing 
        controls 
        config={config}
      />
    );
  }
}

export default Stream;
