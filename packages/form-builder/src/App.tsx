import * as React from 'react';

import {ShortcutProvider} from '@wordpress/keyboard-shortcuts';
import BlockEditorContainer from './containers/BlockEditorContainer';
import {FormStateProvider} from './stores/form-state';
import {Storage} from './common';
import type {Block} from '@givewp/form-builder/types';

import './App.scss';

import defaultBlocks from './blocks.json';
import {__} from '@wordpress/i18n';
import Feedback from "@givewp/form-builder/feedback";

const {blocks: initialBlocks, formSettings: initialFormSettings} = Storage.load();

const initialState = {
    blocks: initialBlocks || (defaultBlocks as Block[]),
    settings: {
        formTitle: __('My Default Donation Form Title', 'give'),
        enableDonationGoal: false,
        enableAutoClose: false,
        registration: 'none',
        goalType: 'amount',
        goalAchievedMessage: __('Thank you to all our donors, we have met our fundraising goal.', 'give'),
        designId: 'classic',
        showHeading: true,
        showDescription: true,
        heading: __('Support Our Cause', 'give'),
        description: __(
            'Help our organization by donating today! Donations go to making a difference for our cause.',
            'give'
        ),
        primaryColor: '#69b86b',
        secondaryColor: '#f49420',
        receiptHeading: __('Hey {donor.firstName}, thanks for your donation!', 'give'),
        receiptDescription: __('{donor.firstName}, your contribution means a lot and will be put to good use in making a difference. We’ve sent your donation receipt to {donor.email}.', 'give'),
        ...initialFormSettings,
    },
};

if (initialBlocks instanceof Error) {
    alert('Unable to load initial blocks.');
    console.error(initialBlocks);
}

function App() {
    return (
        <FormStateProvider initialState={initialState}>
            <ShortcutProvider>
                <BlockEditorContainer />
                <Feedback />
            </ShortcutProvider>
        </FormStateProvider>
    );
}

export default App;
