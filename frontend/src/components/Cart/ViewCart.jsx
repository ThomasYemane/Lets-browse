import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchCart} from "../../store/cart";
import  './ViewCart.css'

export default function ViewProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => Object.values(state.cart.entries));
    useEffect(() => {
        dispatch(fetchCart());    
    }, [dispatch]);
    

    return(
        <>
        <div className="cartContainer">
             <hr></hr>
            <div className="cartRow">
                <div className="cartCol">ITEM</div>
                <div className="cartCol">Price Per Item</div>
                <div className="cartCol">QTY</div>
                <div className="cartCol">TOTAL</div>
            </div>
            
            {cart.map(cartItem => (
               <div>
                 <hr></hr>
                <div key={cartItem.id} className='cartRow'>
                    
                    <div className="cartCol">
                         <img  src={cartItem.Product.imageUrl} alt={cartItem.Product.name}/>
                        <p>{cartItem.Product.name}</p>
                    </div>
                   <div className="cartCol">{cartItem.Product.description}</div>
                   <div className="cartCol">{cartItem.Product.price}</div>
                   <div className="cartCol">{cartItem.quantity}</div>
                   <div className="cartCol">{cartItem.quantity*cartItem.Product.price}</div>
                </div>
                </div>
            ))}
        </div>
         <hr></hr>
         <div><span className="left">Total</span><span className="right">{cart.reduce((accumulator, cartItem) => accumulator + (cartItem.quantity*cartItem.Product.price), 0)}</span></div>
         <div className="clear"></div>
         <hr></hr>
         <hr></hr>
         <div><button onClick={()=>navigate('/products')} className="left">Continue Shopping</button><button onClick={()=>alert("Under construction")} className="right">Proceed to Checkout</button></div>
        </>
    );
}