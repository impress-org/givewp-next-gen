import {useState} from "react";
import {Fill} from "@wordpress/components";
import {RichText} from "@wordpress/block-editor/build/components";

export default function Popout({ content, setContent }) {

    return (
        <Fill name="InspectorPopout">
            <div style={{width: '100%'}}>
                <header style={{padding:'15px 10px', borderBottom: '1px solid lightgray'}}>
                    <h3 style={{margin: '0'}}>Donation Instructions</h3>
                </header>
                <div style={{padding:'10px', borderBottom: '1px solid lightgray'}}>
                    <RichText
                        style={{height: '200px',maxHeight: '200px',overflowY:'scroll',lineHeight:'1.6'}}
                        multiline={true}
                        identifier="content"
                        tagName="p"
                        value={ content }
                        onChange={ setContent }
                        placeholder={'PLACEHOLDER TEXT'}
                    />
                </div>
                <div style={{display:'flex',gap:'20px',padding:'10px', borderBottom: '1px solid lightgray'}}>
                    <span>Visual</span>
                    <span>Text</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'20px',padding:'15px 10px', borderBottom: '1px solid lightgray'}}>
                    <div>Text Style</div>
                    <div>Text Format</div>
                    <div>Alignment</div>
                    <div>List Style</div>
                    <div>Insert</div>
                </div>
            </div>
        </Fill>
    )
}
