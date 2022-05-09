import Frame from 'react-frame-component';
import {Fragment, ReactChild, ReactNode, useRef, useState} from 'react';
import getWindowData from '../utilities/getWindowData';

const [stylesheets] = getWindowData('stylesheets');

const Head = () => (
    <Fragment>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {stylesheets.map(({id, href}) => {
            return <link rel="stylesheet" id={id} href={href} media="all" key={id} />;
        })}
    </Fragment>
);

type Props = {
    children: ReactChild;
    head: ReactNode;
};

export default function IFrame({children, head, ...props}: Props) {
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
                ref={iframeRef}
                contentDidMount={() => setHeight(iframeRef.current.contentDocument.body.offsetHeight)}
                contentDidUpdate={() => setHeight(iframeRef.current.contentDocument.body.offsetHeight)}
                head={head}
                {...props}
            >
                {children}
            </Frame>
        </div>
    );
}
