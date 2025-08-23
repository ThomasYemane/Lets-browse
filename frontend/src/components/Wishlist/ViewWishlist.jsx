import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlists} from "../../store/wishlist";
import './ViewWishlist.css'

export default function ViewProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlists = useSelector(state => Object.values(state.wishlist.entries));
    useEffect(() => {
        dispatch(fetchWishlists());    
    }, [dispatch]);
    

    return(
        <>
        <div className="prodContainer">
            {wishlists.map(wishlist => (
                <div key={wishlist.id} className='prodColumn'>
                    <div onClick={()=>navigate(`/products/${wishlist.productId}`)}>
                        <img  src={wishlist.Product.imageUrl} alt={wishlist.Product.name} className="prodImage"/>
                        <div className="prodText">
                            <p className="prodName">{wishlist.Product.name}</p>
                            <p className="prodDesc">{wishlist.Product.description}</p>
                            <p className="prodPrice">Price: {wishlist.Product.price}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}