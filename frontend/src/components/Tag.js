import React from 'react';
import './styles/tag.css';

export default function Tag( {type, input} ) {
    // recent purchase tag
    if (type === 1) {
        return (<div className="recent-purchase tag">
                <div className="text">{input} purchased recently</div>
            </div>)
    }
    // time tag
    else {
        let body = "not recently ordered"
        if (input.length > 0) {
            let itemTime = input[input.length - 1].date
            let diff = Math.floor((Date.now() - Date.parse(itemTime)) / (1000 * 60))
            if (diff >= 1440) {
                body = "ordered 1 day ago"
            }
            else if (diff >= 120){
                body = `ordered ${Math.floor(diff / 60)} hrs ago`
            }
            else if (diff >= 60) {
                body = `ordered 1 hr ago`
            }
            else {
                body = `ordered ${diff} min ago`
            }
        }
        return (
            <div className="time tag">{body}</div>
        )
    }
}