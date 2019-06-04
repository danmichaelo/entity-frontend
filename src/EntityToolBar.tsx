import React from 'react';
import Typography from "@material-ui/core/Typography";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const styles = createStyles({
    toolBar: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
});

export interface AppProps extends WithStyles<typeof styles> {
    registryId: string;
    handleNew(): void;
    handlePersist(): void;
    setAuthorised(authorised: string): void;
    chooseRegistry(): void; 
}

const EntityToolBar = (props: AppProps) => {
    
    const { classes, registryId, handleNew, handlePersist, setAuthorised, chooseRegistry } = props;

    const handleLogout = () => {
        setAuthorised('');
        chooseRegistry();
    }

    return (
        <div className={classes.toolBar}>
            <AppBar position="static" color="default">
                <Toolbar variant="dense">
                    <Typography className={classes.grow} variant="h6" color="inherit" align="left">
                    Emneord ({registryId})
                    </Typography>
                    <Button onClick={handleNew} color="inherit">New</Button>
                    <Button onClick={handlePersist} color="inherit">Save</Button>
                    <Button onClick={chooseRegistry} color="inherit">Registry</Button>
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withStyles(styles)(EntityToolBar);
