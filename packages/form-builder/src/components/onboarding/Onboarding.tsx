import {useContext, useEffect} from "react";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd";
import options from './options'
import steps from './steps'

import "shepherd.js/dist/css/shepherd.css";
import {useSelect, useDispatch} from "@wordpress/data";


function AutoStart() {
    // @ts-ignore
    const tour = window.tour = useContext(ShepherdTourContext);

    const completed = localStorage.getItem('givewp-next-gen-onboarding-complete') === 'true';

    const {selectBlock} = useDispatch('core/block-editor');
    document.addEventListener('selectAmountBlock', () => {
        const amountBlock = document.querySelector('[data-type="custom-block-editor/donation-amount-levels"]');
        const amountBlockId = amountBlock.getAttribute('data-block');
        selectBlock(amountBlockId).then(() => console.log('Amount block selected'));
    })

    tour.on('complete', () => {
        localStorage.setItem('givewp-next-gen-onboarding-complete', 'true');
    })

    useEffect(() => {
        ! completed && ( tour.isActive() || tour.start() )
    })

    return <></>
}


const Onboarding = () => {
    return <ShepherdTour steps={steps} tourOptions={options}>
        <AutoStart/>
    </ShepherdTour>
}

export default Onboarding;
