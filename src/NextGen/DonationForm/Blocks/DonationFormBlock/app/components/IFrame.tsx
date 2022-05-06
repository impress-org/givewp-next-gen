import Frame from 'react-frame-component';
import {ReactChild, useRef, useState} from 'react';

const initialContent = `
<!doctype html>
<html lang="en-us">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel='stylesheet' id='twenty-twenty-one-style-css'  href='https://givewp.test/wp-content/themes/twentytwentyone/style.css?ver=1.5' media='all' />
    </head>
    <body>
        <div></div>
    </body>
</html>`;

type Props = {
    children: ReactChild,
}

export default function IFrame({children, ...props}: Props) {
    const [height, setHeight] = useState<number>();
    const iframeRef = useRef<HTMLIFrameElement>();

    return (
        <div
            style={{
                width: '100%',
                height,
            }}
        >
            <Frame
                style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'hidden',
                    border: 'none',
                }}
                initialContent={initialContent}
                ref={iframeRef}
                contentDidMount={() => setHeight(iframeRef.current.contentDocument.body.offsetHeight)}
                {...props}
            >
                {children}
            </Frame>
        </div>
    );
}
