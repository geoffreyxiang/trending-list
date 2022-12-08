import React, { useState, useRef, useEffect, useCallback } from 'react';
import useScroll from './useScroll';
import Item from './Item';
import './styles/scroll.css';

export default function Scroll() {
    const [pageNumber, setPageNumber] = useState(1)

    const { error, items } = useScroll(pageNumber)

    const loader = useRef()
    const handleObserver = useCallback((entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
            // console.log('visible')
            setPageNumber((prev) => prev + 1)
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver)
        if (loader !== null) observer.observe(loader.current)
    }, [loader, handleObserver])
    
    return (
        <div>
            <div className="title">Trending at Snakpass</div>
            {items.map((item, index) => {
                return <Item key={index} item={item}/>
            })}
            <div>{error && 'Error'}</div>
            <div ref={loader}></div>
        </div>
    )
}