import React from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        flexGrow: 1,
    }
});

class NavBar extends React.Component{

    handleClick = (e) => {
        this.props.dispatch({
            type: 'INIT_DATE'
        })
        this.props.dispatch({
            type: 'INIT_NUM'
        })
        this.props.dispatch({
            type: 'CLEAR_BAR'
        })
        this.props.dispatch({
            type: 'IS_SUCCESS'
        })
        this.props.dispatch({
            type: 'DATE_IS_SUCCESS'
        })
        this.props.dispatch({
            type: 'HANDLE_BAR'
        })
        this.props.dispatch({
            type: 'CLEAR_DASHBOARD'
        })
        this.props.dispatch({
            type: 'CLEAR_DATE'
        })
        this.props.dispatch({
            type: 'CLEAR_QUESTIONDATE'
        })
        this.props.dispatch({
            type: 'CLEAR_FORM'
        })
        this.props.dispatch({
            type: "INIT_GROUP"
        })
        this.props.dispatch({
            type: 'logouted'
        })
        this.props.dispatch({
            type: 'CLEAR_PIE'
        })
        this.props.dispatch({
            type: 'HIDE_BAR'
        })
        this.props.dispatch({
            type: 'HIDE_FORM'
        })
        this.props.dispatch({
            type: 'HIDE_GRAPH'
        })
        this.props.dispatch({
            type: 'HIDE_PIE'
        })
        this.props.dispatch({
            type: 'HIDE_QUESTION'
        })
        this.props.dispatch({
            type: 'CLEAR_TILE'
        })
    }
    
    render(){
        const { classes } = this.props;
        
        return(
             <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} noWrap>
                        Employee Sentiment
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={this.handleClick}>Logout</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reducer: state
    }
}


export default connect(mapStateToProps)(withStyles(styles)(NavBar));