import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useScroll(pageNumber) {
    const url = 'http://localhost:3030/items'
    
    const [error, setError] = useState(false)
    const [items, setItems] = useState([])

    useEffect(() => {
        setError(false)
        axios.get(url + "/" + pageNumber).then((res) => {
            setItems((prevItems) => {
                return [...prevItems, ...res.data]
            })
        })
        .catch((e) => {
            console.log(e)
            setError(true)
            return
        })
    }, [pageNumber])
    return { error, items }
}