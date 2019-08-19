import React, { useState } from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Header from './Header';
import { Grid } from '@material-ui/core';
import EntityRegistrationForm from './EntityRegistrationForm';
import EntityDataPresentation from './EntityDataPresentation';
import { JsonFormsState, getData } from '@jsonforms/core';
import { connect } from 'react-redux';
import { writeEntity } from './utils';

const styles = createStyles({
    container: {
        padding: '1em'
    },
});

export interface DataProps extends WithStyles<typeof styles> {
    registryId: string;    
    user: string;
    data: object;
    setAuthorised(authorised: boolean): void;
    newEntity(registryName: string): void;
    apiKey: string;
}

const EntityRegistrationApp = (props: DataProps) => {

    const { classes, registryId, setAuthorised, user, data, newEntity, apiKey } = props;
    
    const handleNew = (): void => {
        newEntity(registryId);
    }

    const [ spinner, setSpinner] = useState(false);

    const handlePersist = (): void => {
        setSpinner(true);
        writeEntity(registryId, (data as any)['@id'], apiKey, data).then(() => {
            setSpinner(false);
        })
    }

    return (
        <div>
            <Header 
                spinner={spinner} 
                user={user} 
                setAuthorised={setAuthorised}
            />
            
            <Grid container justify={'center'} spacing={8} className={classes.container}>
                <Grid item sm={9}>
                    <EntityRegistrationForm
                        registryId={registryId}
                        handleNew={handleNew}
                        handlePersist={handlePersist}
                    />
                </Grid>
                <Grid item sm={9}>
                    <EntityDataPresentation
                        dataAsString={JSON.stringify(data, null, 2)}
                    />                                    
                </Grid>
            </Grid>
            }
        </div>
    );

}

const mapStateToProps = (state: JsonFormsState) => {
    return { data: getData(state) }
};

export default connect(mapStateToProps)(withStyles(styles)(EntityRegistrationApp));
