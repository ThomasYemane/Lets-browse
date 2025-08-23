import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts,  deleteProduct} from "../../store/products";
import { confirmable, ConfirmDialog, createConfirmation } from 'react-confirm';
import './ProductList.css'
import {fetchCategories} from '../../store/categories';

export default function ViewProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categoryId, setCategoryId] = useState(0);
    const products = useSelector(state => Object.values(state.products.entries));
    const categories = useSelector(state => Object.values(state.categories.entries));
    useEffect(() => {
        dispatch(fetchProducts());  
        dispatch(fetchCategories());      
    }, [dispatch]);
    
    const handleUpdate = (id) => {
        navigate('/products/'+id+'/edit');
    };

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

    const handleDelete = async (id) => {
       const dialog = createConfirmation(confirmable(deleteConfirmation));
        if(await dialog({ message: 'Are you sure you want to delete this Prodcut?' })){
            dispatch(deleteProduct(id));
        }
    }

    return(
        <>
        <div className="categoryContainer">
            <ul className="category">
                <li className="categoryItem" onClick={()=>{setCategoryId(0)}}><span>All</span></li>
                {categories.map(category => (
                    <li className="categoryItem" value={category.id} onClick={()=>{setCategoryId(category.id);}}><span>{category.name}</span></li>
                ))}
            </ul>
        </div>
        <div className="prodContainer">
            {products.filter(product=>categoryId==0?true:product.categoryId===categoryId).map(product => (
                <div key={product.id} className='prodColumn'>
                    <div>
                    <Link to={`/products/${product.id}`}>
                        <img  src={product.imageUrl} alt={product.name} className="prodImage"/>
                        </Link>
                        <div className="prodText">
                            <p className="prodName">{product.name}</p>
                            <p className="prodDesc">{product.description}</p>
                            <p className="prodPrice">Price: {product.price}</p>
                            <p className="prodQuantity">Quantity: {product.quantity}</p>
                        </div>
                        <div>
                            <button type="button" onClick={()=>handleUpdate(product.id)} className="updateButton">Update</button>
                            <button type="button" onClick={()=>handleDelete(product.id)} className="deleteButton">Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}