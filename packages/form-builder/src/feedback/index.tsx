import React, {useEffect, useState} from "react";
import {__} from '@wordpress/i18n';
import Container from './Container'
import FeedbackButton from "./FeedbackButton";

import {Container as PopupContainer, Header as PopupHeader} from './popup'

const feedbackUrl = 'https://feedback.givewp.com/next-gen';

const HIDE_FEEDBACK = 'givewpNextGenHideFeedback'

const Feedback = () => {

    const [ hidden, setHidden ] = useState(true)
    const closeCallback = () => {
        setHidden(true)
        localStorage.setItem(HIDE_FEEDBACK, 'true')
    }

    useEffect(() => {
        setHidden(!! localStorage.getItem(HIDE_FEEDBACK))
    })

    return (
        <Container>
            {!hidden && (
                <PopupContainer>
                    <PopupHeader title={__('Have feedback?', 'givewp')} closeCallback={closeCallback} />
                    <div>
                        {__('Let us know what you think about the form builder to help improve the product experience.', 'givewp')}
                        {' '}
                        <a href={feedbackUrl} target="_blank" rel="noopener noreferrer" onClick={closeCallback}>
                            {__('Click here', 'givewp')}
                        </a>
                    </div>
                </PopupContainer>
            )}
            <FeedbackButton href={feedbackUrl}>
                {__('Feedback', 'givewp')}
            </FeedbackButton>
        </Container>
    )
}

export default Feedback;
