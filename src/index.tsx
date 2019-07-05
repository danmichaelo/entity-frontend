import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { combineReducers, createStore, Reducer, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import schema from './schema.json';
import uischema from './uischema.json';
import { jsonformsReducer, JsonFormsState } from '@jsonforms/core';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Amplify from 'aws-amplify';
import config from './config';
import AWS from 'aws-sdk';
import awsmobile from './aws-exports';
import { initialiseStore, createRegistryUri } from './utils';
import { findEntityIdentifierInPath, findRegistryIdentifierInPath } from './utils';

let data = {
    "@context": "something",
    identifier: "12345",
    preferredLabel: [
        {
            value: "prefLabel",
            lang: "English",
        }
    ],
    alternativeLabel: [
        {
            value: "altLabel",
            lang: "English",
        }
    ],
    related: ["related"],
    definition: "definition",
    seeAlso: ["seeAlso"],
    inScheme: "schema",
};

AWS.config.update({region: config.cognito.REGION});

Amplify.configure(awsmobile);

Amplify.configure({
    API: {
        endpoints: [
            {
                name: "entity",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    }
});


const initState: JsonFormsState = {
    jsonforms: {
        cells: materialCells,
        renderers: materialRenderers
    }
}

const rootReducer: Reducer<JsonFormsState, AnyAction> = combineReducers({ jsonforms: jsonformsReducer() });
const store = createStore(rootReducer, initState);

const registryName = findRegistryIdentifierInPath();
const identifier = findEntityIdentifierInPath();
if(Boolean(identifier)){
    data.identifier = identifier;
    data.preferredLabel[0].value = "prefLabel-" + registryName;
}

const newEntity = (registryName: string): void => {
    (data as any) = { inScheme: createRegistryUri(registryName) }; // Correct uri in here
    initialiseStore(store.dispatch, data, schema, uischema);
}

initialiseStore(store.dispatch, data, schema, uischema);

ReactDOM.render(
    <Provider store={store}>
        <App 
            newEntity={newEntity}
            data={data}
        />
    </Provider>,
    document.getElementById('root')
);
