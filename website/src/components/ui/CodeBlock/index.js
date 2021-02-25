import React from 'react';
import CodeFrame from 'react-highlight';
import 'highlight.js/styles/night-owl.css';

export function CodeBlock({ value, language }) {
    return (
        <div className="codeBlock">
            <CodeFrame className={language}>{value}</CodeFrame>
        </div>
    );
}
