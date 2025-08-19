import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/products";

export default function ProductDetails(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector(state => Object.values(state.products.entries));
    const product = products.find((p) => p.id === Number(id));
    useEffect(() => {
        if (!product) dispatch(fetchProducts());    
    }, [dispatch, product, id]);

    return (
        <>
            <div>
                <img  src={product.imageUrl} alt={product.name} className="prodImage"/>
                <span>{product.name}</span>
            </div>
        </>
    );

}