import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from "./Components/NavBar/Navbar"
import SideBar from "./Components/SideBar/SideBar"
import { Toolbar } from '@material-ui/core'

import Question from './Pages/QuestionPage/QuestionPage'
import Dashboard from './Pages/Dashboard/Dashboard'




const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

}));




function App() {

  const classes = useStyles();

  return (
    
    <Router>
      <div className={classes.root}>

        <Navbar />
        <SideBar />

        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route path="/question" component={Question} />
            <Route path="/" component={Dashboard} />
            <Dashboard/>
          </Switch>
        </main>
      </div>
    </Router>

  );
}


export default App;