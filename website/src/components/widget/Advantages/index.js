import React from 'react';
import { Title } from '../../ui/Title';
import './styles.css';
import { Debug } from '../../icons/Debug';
import { Middle } from '../../icons/Middle';
import { ReactIcon } from '../../icons/React';
import { Async } from '../../icons/Async';
import { Arch } from '../../icons/Arch';

export function Advantages() {
    return (
        <div className="advantages">
            <div className="advantagesWrapper">
                <Title text={'Advantages'} />
                <div className="grid">
                    <div className="col">
                        {' '}
                        <Arch />
            Flexible architecture
                    </div>
                    <div className="col">
                        <Async />
            Asynchronous out of the box
                    </div>
                    <div className="col">
                        <ReactIcon />
            React support
                    </div>
                    <div className="col">
                        <Middle /> Simple extension with middleware
                    </div>
                    <div className="col">
                        <Debug />
            Easy debugging
                    </div>
                </div>
                <div className="donate">
                    <div className="donateText">Donate</div>
                    <a
                        href="https://www.buymeacoffee.com/biscuitstore"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <img
                            src="./image/default-yellow.png"
                            width="220px"
                            alt="Buy Me A Coffee"
                        />
                    </a>
                </div>
                <div className="feedback">
          feedback: <b>biscuitstorejs@gmail.com</b>
                </div>
            </div>
        </div>
    );
}
