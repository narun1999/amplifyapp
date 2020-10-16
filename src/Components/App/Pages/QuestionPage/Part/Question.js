import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    InputStyle: {
        color: "black",
        fontWeight: "bold",
        fontSize: "24px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(1)
    }
});

class Question extends Component {

    handltDelete = (e) => {
        
    }

    render() {
        const answer = this.props.form.answer
        const { classes } = this.props;
        
        
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={0} >
                        <div>
                            <Typography gutterBottom fontWeight="fontWeightBold" fontFamily="Monospace" variant="h6">{this.props.form.question}</Typography>
                            <h1>{answer.map((item, i) => {
                                return <Typography fontWeight="fontWeightRegular" fontFamily="Monospace"  >{item}</Typography>
                            })}</h1>
                            <Box component="span" m={1}><Button variant="contained" color="default" startIcon={<EditIcon />} onClick={() => this.props.dispatch({ type: "EDIT_FORM", id: this.props.form.id })}>แก้ไข</Button></Box>
                            <Box component="span" m={1}> <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => (this.props.dispatch({ type: "DELETE_FORM", id: this.props.form.id }))}>ลบ</Button></Box>
                            
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}


export default connect()(withStyles(styles)(Question));

