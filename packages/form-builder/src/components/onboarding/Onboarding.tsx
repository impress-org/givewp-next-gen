import {useContext, useEffect} from "react";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd";
import options from './options'
import steps from './steps'

import "shepherd.js/dist/css/shepherd.css";


function AutoStart() {
    const tour = useContext(ShepherdTourContext);

    useEffect(() => {
        tour.isActive() || tour.start()
    })

    return <></>
}


const Onboarding = ({children}) => {
    return (
        <ShepherdTour steps={steps} tourOptions={options}>
            <AutoStart/>
            {children}
        </ShepherdTour>
    )
}

export default Onboarding;
