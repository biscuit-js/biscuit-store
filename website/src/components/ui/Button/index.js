import React from 'react';
import './styles.css';

export function Button({ text, type, onClick }) {
    return (
        <button className={type} {...{ onClick }}>
            {text}
        </button>
    );
}
