import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Navbar from "./Components/NavBar/Navbar"
import SideBar from "./Components/SideBar/SideBar"
import { Toolbar } from '@material-ui/core'
import LoginForm from './LoginForm'
import Question from './Pages/QuestionPage/QuestionPage'
import Dashboard from './Pages/Dashboard/Dashboard'
import { connect } from 'react-redux'

const styles = theme => ({
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

});


class App extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div>
        
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
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reducer: state
  }
}

export default connect(mapStateToProps)(withStyles(styles)(App));