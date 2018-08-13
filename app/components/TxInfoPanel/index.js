import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  info: {
    color: 'blue'
  },
  warning: {
    color: 'red'
  }
});

function PaperSheet(props) {
  const { classes, txInfo, txInfoLoadingError } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={1}>
        <Typography variant="headline" component="h3">
          Transaction sent
        </Typography>
        {
          txInfo && 
              (<Typography component="h4" className={classes.info}>
              {
                `TX HASH: ${txInfo.get('hash') }
                 TX StATUS:  ${txInfo.get('status')}  
                `
              }
            </Typography>)
        }                
        {txInfoLoadingError && 
        (<Typography component="p">
          {txInfoLoadingError.message}
        </Typography>)
        }
      </Paper>
    </div>
  );
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
  txInfo: PropTypes.object,
  txInfoLoadingError: PropTypes.object,
};
const TxInfoPanel = withStyles(styles)(PaperSheet);
export default TxInfoPanel;