import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import Rating from "react-rating";
import { FaStar } from "react-icons/fa";
import { confirmable, createConfirmation } from 'react-confirm';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/products";
import { fetchReviews, createReview, deleteReview } from "../../store/reviews";
import {addToCart} from '../../store/cart'
import {createWishlist, deleteWishlist} from '../../store/wishlist'

import './ProductDetails.css'

export default function ProductDetails(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const sessionUser = useSelector(state => state.session.user);
    const reviews = useSelector(state => Object.values(state.reviews.entries));
    const product = useSelector(state => state.products.entries[id]);

    useEffect(() => {
        if (!product) {
            dispatch(fetchProducts()); 
        }
        dispatch(fetchReviews(id));
    }, [dispatch, product]);
    
    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const reviewDialogStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        return formattedDate;
    }

    const handleReviewSubmit = (e) => {
       e.preventDefault();
        const data = {
            review: review.trim(),
            productId: id,
            stars: parseInt(stars)
        }
        dispatch(createReview(data));
        setIsOpen(false);
    }

    const deleteConfirmation = ({ show, proceed, message }) => {
        if (!show) {
            return null;
        }
        return (
            <div className="dialogOverlay">
            <div className="dialogContent">
                <p>{message}</p>
                <div>
                        <button className="yesButton" onClick={() => proceed(true)}>YES</button>
                        <button className="noButton" onClick={() => proceed(false)}>NO</button>
                </div>
            </div>
            </div>
        );
        };

    const handleDeleteButton = async (id) => {
        const dialog = createConfirmation(confirmable(deleteConfirmation));
        if(await dialog({ message: 'Are you sure you want to delete this review?' })){
            dispatch(deleteReview(id));
        }
    }

    const handleCart = async (e) => {
        e.preventDefault();
        const data = {
            productId: id,
            quantity: quantity
        }
        dispatch(addToCart(data));
        navigate('/cart');
    };

    const addToWishlist = async (e) => {
        e.preventDefault();
        const data = {
            productId:id
        }
        dispatch(createWishlist(data));
    }

    const removeFromWishlist = async (e) => {
         e.preventDefault();
         dispatch(deleteWishlist(id))
    }
   
    return (
        <>
           <div className="detailsContainer">

                <div className="detailsCol">
                    <div>
                        <img  src={product?.imageUrl} alt={product?.name} className="prodImage"/>
                        <span>{product?.name}</span>
                        <p>{product?.description}</p>
                    </div>
                    <div>
                        <div>
                            <button onClick={openModal}>Post Review</button>
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={reviewDialogStyles}
                                contentLabel="Review Box">
                                <button className="reviewCloseButton" onClick={closeModal}>close</button>
                                <div>Post Your Review</div>
                                <form onSubmit={handleReviewSubmit}>
                                    <textarea value={review} onChange={e => setReview(e.target.value)} placeholder='Leave your review here ...' rows="10" cols="80"/>
                                    <Rating
                                        initialRating ={stars}
                                        value={stars}
                                        onChange={(x)=>{setStars(x);}}
                                        emptySymbol={<FaStar color="gray" />}
                                        fullSymbol={<FaStar color="gold" />}
                                    />
                                <button type="submit" className="reviewPostButton">Submit Your Review</button>
                                </form>
                            </Modal>
                            </div>
                    </div>



                        <div>
                            {(() => {
                                        const arr = [];
                                        for (let i = 0; i < reviews.length; i++) {
                                            
                                            arr.push(
                                                <div>
                                                    <p  style={{fontWeight:'bold'}} >{reviews[i].User.firstName}</p>
                                                    <p>{formatDate(reviews[i].createdAt)}</p>
                                                    <div><span>{reviews[i].review}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {  sessionUser && sessionUser.id!==product?.ownerId && sessionUser.id===reviews[i].User.id && <button onClick={()=>handleDeleteButton(reviews[i].id)}>delete</button>}
                                                            
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return arr;
                                    })()}

                        </div>
                </div >

                    <div className="detailsCol">
                            <div className="cart">
                            <form onSubmit={handleCart}>
                                <select name="quantity"  onChange={(e) => setQuantity(e.target.value)}>
                                    {Array.from({ length: product?.quantity }, (_, index) => index).map(qty => (
                                        <option value={qty} selected={qty===1}>{qty}</option>
                                    ))}
                                    </select>
                                <button type="submit">Add to Cart</button>
                              </form>
                            </div>

                            <div className="wishlist" onClick={addToWishlist}><button>Add to your wishlist</button></div>
                            

                    </div>

           </div>
        </>
    );

}