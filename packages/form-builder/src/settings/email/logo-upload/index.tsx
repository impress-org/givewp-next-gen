/**
 * @link https://codex.wordpress.org/Javascript_Reference/wp.media
 * @link https://wordpress.stackexchange.com/a/382291
 */

import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import {Button, TextControl} from "@wordpress/components";
import {upload} from "@wordpress/icons";
import {__} from "@wordpress/i18n";
export default () => {
    _.noConflict()
    let frame

    const [logoUrl, setLogoUrl] = useState('')

    const openMediaLibrary = (event) => {
        event.preventDefault()

        if (frame) {
            frame.open()
            return
        }

        frame = window.wp.media({
            title: 'Add or upload file',
            button: {
                text: 'Use this media',
            },
            multiple: false, // Set to true to allow multiple files to be selected
        })

        frame.on( 'select', function() {

            // Get media attachment details from the frame state
            var attachment = frame.state().get('selection').first().toJSON();

            setLogoUrl(attachment.url)
        });

        // Finally, open the modal on click
        frame.open()
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px'}}>
            {/*{logoUrl && <img src={logoUrl} style={{width: '100%'}} />}*/}
            <div> {/* Wrapping the TextControl solves a spacing issue */}
                <TextControl
                    type={'url'}
                    label={__('Logo URL', 'givewp')}
                    value={logoUrl}
                    onChange={(value) => setLogoUrl(value)}
                />
            </div>
            <Button icon={upload} variant={'secondary'} onClick={openMediaLibrary} style={{width:'100%', justifyContent:'center'}}>
                {__('Add or upload file', 'givewp')}
            </Button>
        </div>
    )
}
