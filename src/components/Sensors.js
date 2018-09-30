import React, { Component } from 'react';
import './Sensors.css';

class Sensors extends Component {
  state = {
    intervalId: null,
    temp: "N/A",
    humidity: "N/A",
    lux: "N/A",
  }

  componentDidMount() {
    this.pingSensor();
    let intervalId = setInterval(this.pingSensor, 5000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  pingSensor = () => {
    fetch('http://babymonitor.local:8080/sensor/bme280')
      .then(res => res.json()
        .then(json => {
          this.setState({ 
            temp: json.data.values.temperature,
            humidity: json.data.values.humidity,
          });
        })
      );

    fetch('http://babymonitor.local:8080/sensor/tsl2561')
      .then(res => res.json()
        .then(json => {
          this.setState({ 
            lux: json.data.values.lux,
          });
        })
      );
  }

  render() {
    const { humidity, temp, lux } = this.state;

    return (
      <div className="overlay">
        { this.props.children } 
        <div className="index">
          <span className="icon">
            <i className="fas fa-thermometer-half"></i>
          </span>
          <span className="unit">
            { parseFloat(temp).toFixed(2) }
          </span>
          <span className="symbol">
            &deg;C
          </span>
        </div>
        <div className="index">
          <span className="icon">
            <i className="fas fa-tint"></i>
          </span>
          <span className="unit">
            { parseFloat(humidity).toFixed(2) }
          </span>
          <span className="symbol">
            %
          </span>
        </div>
        <div className="index">
          <span className="icon">
            <i className="far fa-lightbulb"></i>
          </span>
          <span className="unit">
            { parseFloat(lux).toFixed(2) }
          </span>
          <span className="symbol">
            lx
          </span>
        </div>
      </div>
    );
  }
}

export default Sensors;
