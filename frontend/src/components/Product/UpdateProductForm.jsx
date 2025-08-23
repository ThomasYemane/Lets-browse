import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from "react-router-dom";
import {fetchProducts, updateProduct} from '../../store/products';
import {fetchCategories} from '../../store/categories';
import './CreateProductForm.css';

export default function CreateProductForm({onSuccess}){
        const { id } = useParams();
        const dispatch = useDispatch();
        const categories = useSelector(state => Object.values(state.categories.entries));
        const product = useSelector(state => state.products.entries[id]);
        const navigate = useNavigate();
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [imageUrl, setImageUrl] = useState('');
        const [price, setPrice] = useState('');
        const [quantity, setQuantity] = useState('');
        const [categoryId, setCategoryId] = useState(1);
        const [errors, setErrors] = useState({});
         
        useEffect(() => {
            if(categories.length===0){
                dispatch(fetchCategories()); 
            }
            if(!product){
                dispatch(fetchProducts());
            }else{
                setCategoryId(product.categoryId);
                setName(product.name);
                setDescription(product.description);
                setImageUrl(product.imageUrl);
                setPrice(product.price);
                setQuantity(product.quantity);
            }
        }, [dispatch, product]);
       
        function isValidURL(url) {
            try {
                new URL(url);
                return true;
             } catch (error) {
                return false;
            }
       }
       function validateForm(){
       
                const errs = {};
                var valid = true;
                if (!name.trim()) {
                    errs.name = 'Product name cannot be empty.';
                    valid = false
                }
                
                if (!description.trim()) {
                    errs.description = 'Product description cannot be empty.';
                    valid = false;
                }
                 if (!imageUrl.trim()) {
                    errs.imageUrl = 'Product image url cannot be empty.';
                    valid = false;
                }else if(!isValidURL(imageUrl)){
                     errs.imageUrl = 'invalid image Url.';
                     valid = false;
                }
                if(isNaN(parseFloat(price))){
                   errs.price = 'please enter a valid number.';
                   valid = false;
                }
                if(isNaN(parseInt(quantity))){
                    errs.quantity = 'please enter a valid number.';
                    valid = false;
                }
                if(!valid){
                    setErrors(errs);
                    return false;
                }
                return true;
        }
        const handleSubmit = async (e) => {
            
                e.preventDefault();
                setErrors(null);
                if(!validateForm()){
                    return;
                }
                const data = {
                    name: name.trim(),
                    categoryId: categoryId,
                    description: description.trim(),
                    imageUrl: imageUrl.trim(),
                    price: Number(price),
                    quantity: Number(quantity)
                }
                const result = await dispatch(updateProduct(id, data));

                if (result && result.errors) {
                     setErrors(result.errors);
                } else {
                if (onSuccess) onSuccess();
                     navigate('/products');
                }
         };
        
       const handleCancel = () => {
        navigate('/products');
        };

      return(
        <>
          <form onSubmit={handleSubmit}>
                <h2>Update Product</h2>

                <label htmlFor="categories">Choose a category</label>
                <select name="categoryId" id="categoryId" onChange={(e) => setCategoryId(e.target.value)}>
                    {categories.map(category => (
                        <option value={category.id} selected={category.id==categoryId}>{category.name}</option>
                    ))}
                </select>

                <label htmlFor="name"></label>
                <input type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                 {errors && errors.name && <p className='error'>{errors.name}</p>}

                <label htmlFor="description"></label>
                <input type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}/>
                 {errors && errors.description && <p className='error'>{errors.description}</p>}

                <label htmlFor="imageUrl"></label>
                <input type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}/>
                 {errors && errors.imageUrl && <p className='error'>{errors.imageUrl}</p>}
                
                <label htmlFor="price"></label>
                <input type="text"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                 {errors && errors.price && <p className='error'>{errors.price}</p>}

                <label htmlFor="quantity"></label>
                <input type="text"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}/>
                 {errors && errors.quantity && <p className='error'>{errors.quantity}</p>}
                
                <div>
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
               
          </form>
        </>
      );
}