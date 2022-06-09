import {useState} from "react";
import {useToggleState} from "../../hooks";
import {Button} from "@wordpress/components";
import Popout from "../../components/sidebar/popout";

const DonationInstructions = () => {

    const { state: showPopout, toggle: toggleShowPopout } = useToggleState()

    const [ content, setContent ] = useState(`
            <p>You can customize instructions in the form settings.</p>
            <p>Please make checks payable to <strong>"{sitename}"</strong>.</p>
            <p>Your donation is greatly appreciated!</p>
        `)

    return (
        <>
            <div style={{ marginTop: '10px', width: '100%', display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                Donation Instructions
                <Button onClick={toggleShowPopout} style={{color:'white',backgroundColor:'#68BF6B'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                </Button>
            </div>
            { showPopout && <Popout content={content} setContent={setContent} /> }</>
    )
}

export default DonationInstructions
