import {useContext, useEffect} from "react";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd";
import options from './options'
import steps from './steps'

import "shepherd.js/dist/css/shepherd.css";
import {useSelect, useDispatch} from "@wordpress/data";


function AutoStart() {
    const tour = useContext(ShepherdTourContext);

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
        tour.isActive() || tour.start()
    })

    return <></>
}


const Onboarding = () => {
    const completed = localStorage.getItem('givewp-next-gen-onboarding-complete') === 'true';
    return !completed ? (
        <ShepherdTour steps={steps} tourOptions={options}>
            <AutoStart/>
        </ShepherdTour>
    ) : <></>
}

export default Onboarding;
