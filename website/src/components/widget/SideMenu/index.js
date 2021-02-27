import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { CircleIcon } from '../../ui/CircleIcon';
import { Github } from '../../icons/Github';
import { Twitter } from '../../icons/Twitter';
import CustomScroll from 'react-custom-scroll';
import { Npm } from '../../icons/Npm';
import { Menu } from '../../icons/Menu';
import './styles.css';
import { items } from '../../screen/Docs/pages';

export function SideMenu() {
    let history = useHistory();
    const [open, setOpen] = useState(false);
    const [loc, setLoc] = useState(history.location.pathname);

    useEffect(() => {
        const unsubscribe = history.listen((e) => {
            setLoc(history.location.pathname);
        });

        return () => unsubscribe();
    }, [history]);

    const handleActive = (item) => item.url === loc;

    return (
        <div className={`sideMenu${open ? ' active' : ''}`}>
            <div className="menuIcon" onClick={() => setOpen((prev) => !prev)}>
                <Menu />
            </div>
            <div className="iconsBlockVertical">
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/biscuit-js/biscuit-store">
                    <CircleIcon icon={<Github />} />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/BiscuitJs">
                    <CircleIcon icon={<Twitter />} />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/@biscuit-store/core">
                    <CircleIcon icon={<Npm />} />
                </a>
            </div>
            <a href="/" className="logoBlock">
                <img src="/image/logo.png" alt="logo" />
            </a>
            <nav className="menuItems">
                <CustomScroll heightRelativeToParent="100%">
                    <a className="menuItem" href="/">Home</a>
                    {
                        items.map((item, i) => {
                            if (!item.hidden) {
                                return (
                                    <React.Fragment key={i}>
                                        <Link
                                            onClick={() => setOpen((prev) => !prev)}
                                            className={`menuItem ${handleActive(item) ? 'active' : ''}`}
                                            to={item.url}>{item.title}
                                        </Link>
                                        {
                                            item.afterSpace
                                                ?
                                                <React.Fragment>
                                                    <br />
                                                    <br />
                                                </ React.Fragment>
                                                : null
                                        }
                                    </ React.Fragment>
                                );
                            }

                            return null;
                        })
                    }
                </CustomScroll>
            </nav>
        </div>
    );
}
