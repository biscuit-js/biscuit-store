import React from 'react';
import CodeFrame from 'react-highlight';
import 'highlight.js/styles/night-owl.css';
import './styles.css';

export function CodeBox({ code }) {
    return (
        <div className="codeBox">
            <CodeFrame className="javascript">{code}</CodeFrame>
        </div>
    );
}
