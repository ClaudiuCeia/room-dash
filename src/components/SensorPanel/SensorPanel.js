import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PreviewTimeseriesChart from '../PreviewTimeseriesChart/PreviewTimeseriesChart';
import { ParentSize } from '@vx/responsive';

class SensorPanel extends Component {
  state = {
    sensorData: null,
  }

  componentDidMount() {
    this.fetchSensorData();
  }

  fetchSensorData = () => {
    fetch(`http://babymonitor.local:8080/sensor/${this.props.sensor}/5min/288`)
      .then(res => res.json()
        .then(json => {
          let prevIdx = null;
          const cleanData = json.map(value => {
            let idx = parseFloat(value.data.values[this.props.index]);
            if (isNaN(idx)) {
              idx = 0;
            }

            if (prevIdx === null) {
              prevIdx = idx;
            }

            if (Math.abs(idx - prevIdx) > this.props.tolerance) {
              idx = prevIdx;
            }

            prevIdx = idx;
            return {
              time: value.data.values.time,
              index: idx,
            }
          }).sort((a, b) => a.time - b.time);

          if (this.props.debug) {
            console.log(cleanData);
          }
          this.setState({
            sensorData: cleanData,
          });
        })
      );
  }

  render() {
    const { sensorData } = this.state;

    if (!sensorData) {
      return <div></div>
    }

    return (
      <Card>
        <div style={{ width: "100%", height: 200 }}>
          <ParentSize className="graph-container">
            {({ width: w, height: h }) => {
              return (
                <PreviewTimeseriesChart
                  symbol={this.props.symbol}
                  parentWidth={w}
                  parentHeight={h}
                  data={sensorData}
                  margin={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 45
                  }}
                />
              );
            }}
          </ParentSize>
        </div>
        <CardContent style={{ width: "100%" }}>
          <Typography gutterBottom variant="headline" component="h2">
            { this.props.title }
          </Typography>
          <Typography component="p">
            { this.props.description }
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Details
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default SensorPanel;
