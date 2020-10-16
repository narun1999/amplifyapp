import React from 'react';



import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}));


const NavBar = props => {

    const classes = useStyles();
    return (


        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Employee Sentiment
                </Typography>
            </Toolbar>
        </AppBar>


    );

};

export default NavBar;