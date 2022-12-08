import React from 'react';
import './styles/item.css';
import Tag from './Tag';

export default function Item( {item} ) {
    return (
        <div className="item">
            <div className="words">
                <div className="food">{item.name} (${item.price})</div>
                <div className="restaurant">{item.restaurant_name}</div>
            </div>
            <div className="tags">
                <Tag type={1} input={item.quantity}/>
                <Tag type={2} input={item.order_history}/>
            </div>
        </div>
    )
}