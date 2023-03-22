import {useContext} from "react";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd";
import options from './options'
import steps from './steps'

import "shepherd.js/dist/css/shepherd.css";


function StartButton() {
    const tour = useContext(ShepherdTourContext);

    return (
        <button className="button dark" onClick={tour.start} style={{position: "fixed", top: '100px', left: 0}}>
            Start Tour
        </button>
    );
}


const Onboarding = ({children}) => {
    return (
        <ShepherdTour steps={steps} tourOptions={options}>
            <StartButton />
            {children}
        </ShepherdTour>
    )
}

export default Onboarding;
