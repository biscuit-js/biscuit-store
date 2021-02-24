import React from 'react';
import { Title } from '../../ui/Title';
import './styles.css';

export function About() {
    return (
        <div className="about">
            <div className="aboutWrapper">
                <Title text={'About Biscuit'} />
                <p className="text">
          Biscuit allows you to create javascript applications with predictable
          state containers, and also provides an extensive set of tools for
          working with them. With this library, you can easily create
          applications with a convenient centralized state system, update
          components, and get a positive development experience.
                </p>
            </div>
        </div>
    );
}
