import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/products";
import './ProductList.css'

export default function ViewProducts() {
    const dispatch = useDispatch();
    const products = useSelector(state => Object.values(state.products.entries));
    useEffect(() => {
        dispatch(fetchProducts());    
    }, [dispatch]);
    
    return(
        <>
        <div className="prodContainer">
            {products.map(product => (
                <div key={product.id} className='prodColumn'>
                    <div>
                    <Link to={`/products/${product.id}`}>
                        <img  src={product.imageUrl} alt={product.name} className="prodImage"/>
                        </Link>
                        <div className="prodText">
                            <span className='prodName'>{product.name}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}