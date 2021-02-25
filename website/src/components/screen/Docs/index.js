import React, { useEffect, useRef, useState } from 'react';
import { SideMenu } from '../../widget/SideMenu';
import { ArrowUp } from '../../icons/ArrowUp';
import { Loader } from '../../ui/Loader';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './styles.css';
import 'highlight.js/styles/night-owl.css';
import 'highlight.js';
import gfm from 'remark-gfm';
import toc from 'remark-toc';
import { CodeBlock } from '../../ui/CodeBlock';
import { items } from './pages';

function flatten(text, child) {
    return typeof child === 'string'
        ? text + child
        : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function HeadingRenderer(props) {
    let children = React.Children.toArray(props.children);
    let text = children.reduce(flatten, '');
    let slug = text.replace('.', '').replace(/\W/g, '-');
    return React.createElement('h' + props.level, { id: slug }, props.children);
}

function LoadMakdown({ file, scroll }) {
    const anchorRef = useRef(null);
    const [data, setData] = useState({ md: '' });
    const [load, setLoad] = useState(true);
    const [scrollTo, setScrollTo] = useState(false);

    useEffect(() => {
        const getMd = async (item) => {
            setLoad(true);
            const res = await fetch(`/docs/${item}.md`);
            const content = await res.text();
            await setData({ md: content });
            setLoad(false);
            if (window.location.hash.length) {
                anchorRef.current.click();
            }
        };
        getMd(file);
    }, [file]);

    useEffect(() => {
        scroll.current.addEventListener('scroll', (e) => {
            if (e.target.scrollTop > 0) {
                setScrollTo(true);
                return;
            }
            setScrollTo(false);
        });
    }, [scroll]);

    const handleScrollTop = () => {
        scroll.current.scrollTo(0, 0);
    };

    return (
        <>
            <Loader state={load} />
            <div
                onClick={handleScrollTop}
                className={`toTop ${scrollTo ? 'active' : null}`}>
                <ArrowUp />
            </div>
            <div className="markdown-body" >
                <ReactMarkdown
                    renderers={{ code: CodeBlock, heading: HeadingRenderer }}
                    allowDangerousHtml
                    plugins={[gfm, toc]}
                    children={data.md}
                />
                <a style={{ display: 'none' }} ref={anchorRef} href={window.location.hash} >-</a>
            </div>
        </>
    );
}

export function Docs() {
    const scrollRef = useRef(null);

    return (
        <Router>
            <div className="docs">
                <SideMenu />
                <div ref={scrollRef} className="viewer">
                    <Switch>
                        {
                            items.map((item, i) =>
                                <Route key={i} path={item.url}>
                                    <LoadMakdown scroll={scrollRef} file={item.file} />
                                </Route>
                            )
                        }
                    </ Switch>
                </div>
            </div>
        </ Router>
    );
}
