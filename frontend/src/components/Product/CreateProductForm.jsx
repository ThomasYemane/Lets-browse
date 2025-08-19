import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {fetchCategories} from '../../store/categories';

export default function CreateProductForm({onSuccess}){
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [imageUrl, setImageUrl] = useState('');
        const [price, setPrice] = useState('');
        const [quantity, setQuantity] = useState('');
        const [categoryId, setCategoryId] = useState('');
        const [error, setError] = useState(null);
        const categories = useSelector(state => Object.values(state.categories.entries));
       
      useEffect(() => {
              dispatch(fetchCategories());    
          }, [dispatch]);

      return(
        <>
          <form>
                <h2>Add New Product</h2>

                <label htmlFor="categories">Choose a category</label>
                <select name="categoryId" id="categoryId" onselect="(e) => setCategoryId(e.target.value)">
                    {categories.map(category => (
                        <option value={category.id}>{category.name}</option>
                    ))}
                </select>

                <label htmlFor="name"></label>
                <input type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        placeholder="Product name"/>

                <label htmlFor="description"></label>
                <input type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoFocus
                        placeholder="Product description"/>

                <label htmlFor="imageUrl"></label>
                <input type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        autoFocus
                        placeholder="Image url"/>
                
                <label htmlFor="price"></label>
                <input type="text"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        autoFocus
                        placeholder="Price"/>

                <label htmlFor="quantity"></label>
                <input type="text"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        autoFocus
                        placeholder="Quantity"/>
                
                <div>
                    <button type="submit">Add Product</button>
                    <button type="button">Cancel</button>
                </div>
               
          </form>
        </>
      );
}