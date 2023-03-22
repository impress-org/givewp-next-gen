import {renderToStaticMarkup} from "react-dom/server";
import Logo from "@givewp/form-builder/components/icons/logo";

const TextContent = ({title, description, stepNumber, stepCount, isFirst, isLast}) => {
    return (
        <div>
            {isFirst && (
                <div style={{display: "flex", justifyContent: 'center', margin: 'var(--givewp-spacing-4) auto'}}>
                    <Logo/>
                </div>
            )}
            {!isFirst && !isLast &&(
                <div style={{display:'flex', backgroundColor: 'var(--givewp-blue-25)', fontSize: '12px',padding:'4px',borderRadius:'2px',justifyContent:'space-between'}}>
                    <div>
                        <strong>Tour guide</strong>: Form builder mode
                    </div>
                    <div><strong>{stepNumber}</strong>/{stepCount}</div>
                </div>
            )}
            <h3 style={{
                fontSize: isFirst || isLast ? '20px' : '16px',
                margin: 'var(--givewp-spacing-3) 0',
            }}>{title}</h3>
            <p style={{fontSize: '14px'}}>{description}</p>
        </div>
    )
}

const withText = (steps) => {

    return steps.map((step, index) => {
        const textContent = <TextContent
            title={step.title}
            description={step.text}
            stepNumber={index + 1}
            stepCount={steps.length}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
        />;
        return {...step, ...{
                text: renderToStaticMarkup(textContent)
            }}
    })
}

export default withText
