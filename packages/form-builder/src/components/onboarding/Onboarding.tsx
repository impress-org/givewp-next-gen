import {useContext, useEffect} from "react";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd";
import options from './options'
import steps from './steps'

import "shepherd.js/dist/css/shepherd.css";


function AutoStart() {
    const tour = useContext(ShepherdTourContext);

    tour.on('complete', () => {
        localStorage.setItem('givewp-next-gen-onboarding-complete', 'true');
    })

    useEffect(() => {
        tour.isActive() || tour.start()
    })

    return <></>
}


const Onboarding = ({children}) => {
    const completed = localStorage.getItem('givewp-next-gen-onboarding-complete') === 'true';
    return (
        <>
            {!completed && (
                <ShepherdTour steps={steps} tourOptions={options}>
                    <AutoStart/>
                </ShepherdTour>
            )}
            {children}
        </>
    )
}

export default Onboarding;
