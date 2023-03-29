import {useContext, useEffect} from "react";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd";
import options from './options'
import steps from './steps'

import "shepherd.js/dist/css/shepherd.css";
import {useSelect, useDispatch} from "@wordpress/data";
import {FormDesign, FormPageSettings} from "@givewp/form-builder/types";

declare global {
    interface Window {
        onboardingTourData?: {
            actionUrl: string;
            autoStartTour: boolean;
        };
    }
}

function AutoStartTour() {
    // @ts-ignore
    const tour = window.tour = useContext(ShepherdTourContext);

    const {selectBlock} = useDispatch('core/block-editor');

    useEffect(() => {

        document.addEventListener('selectAmountBlock', () => {
            const amountBlock = document.querySelector('[data-type="custom-block-editor/donation-amount-levels"]');
            const amountBlockId = amountBlock.getAttribute('data-block');
            selectBlock(amountBlockId).then(() => console.log('Amount block selected'));
        })

        document.addEventListener('click',function(event){
            var element = event.target as Element;
            if(tour.isActive() && element.classList.contains('js-exit-tour')){
                tour.complete();
            }
        },true);

        tour.on('complete', () => {
            fetch(window.onboardingTourData.actionUrl, { method: 'POST' })
        })

        window.onboardingTourData.autoStartTour && ( tour.isActive() || tour.start() )
    })

    return <></>
}

const Onboarding = () => {
    return <ShepherdTour steps={steps} tourOptions={options}>
        <AutoStartTour />
    </ShepherdTour>
}

export default Onboarding;
