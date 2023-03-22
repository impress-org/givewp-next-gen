import {renderToStaticMarkup} from "react-dom/server";

const TextContent = ({title, description, stepNumber, stepCount, showTopbar}) => {
    return (
        <>
            {showTopbar &&(
                <div style={{display:'flex', backgroundColor: 'var(--givewp-blue-25)', fontSize: '12px',padding:'4px',borderRadius:'2px',justifyContent:'space-between'}}>
                    <div>
                        <strong>Tour guide</strong>: Form builder mode
                    </div>
                    <div><strong>{stepNumber}</strong>/{stepCount}</div>
                </div>
            )}
            <h3 style={{
                fontSize:'16px',
                margin: 'var(--givewp-spacing-3) 0',
            }}>{title}</h3>
            <p>{description}</p>
        </>
    )
}

const withText = (steps) => {

    return steps.map((step, index) => {
        const textContent = <TextContent
            title={step.title}
            description={step.text}
            stepNumber={index + 1}
            stepCount={steps.length}
            showTopbar={index !== 0 && index <= steps.length}
        />;
        return {...step, ...{
                text: renderToStaticMarkup(textContent)
            }}
    })
}

export default withText
