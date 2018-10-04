import React from 'react';
import ReactPlayer from 'react-player'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

const styles = s => ({
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%', /* Player ratio: 100 / (1280 / 720) */
  },
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

export default ({ url }) => {
  return (
    <Card>
      <div className={styles.playerWrapper}>
        <ReactPlayer
          className={styles.reactPlayer}
          url={url}
          width='100%'
          height='100%'
          controls
          playing
        />
      </div>
      <CardActions>
        <Button size="small" color="primary">
          Details
        </Button>
      </CardActions>
    </Card>
  );
};
