import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TableChartIcon from '@material-ui/icons/TableChart';
import {Link} from 'react-router-dom'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));




const SideBar = Props => {
    const classes = useStyles();
    return (
        <div>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                <List>
                    
                        <ListItem button component={Link} to="/" >
                            <ListItemIcon>
                            <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary={"DashBoard"} />
                        </ListItem>

                        <ListItem button component={Link} to="/question">
                            <ListItemIcon>
                            <TableChartIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Question"} />
                        </ListItem>

                </List>
                <Divider />          
            </div>
        </Drawer>
     </div>
    );

};

export default SideBar;