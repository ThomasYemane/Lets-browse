import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "../components/Product/ProductList";
import ProductDetails from "../components/Product/ProductDetails";
import CreateProduct from "../components/Product/CreateProduct";
import UpdateProduct from "../components/Product/UpdateProduct";
import ViewCart from "../components/Cart/ViewCart";
import ViewWishlist from "../components/Wishlist/ViewWishlist";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/products/:id/edit" element={<UpdateProduct />} />
        <Route path="/cart" element={<ViewCart />} />
        <Route path="/wishlist" element={<ViewWishlist />} />
      </Routes>
    </BrowserRouter>
  );
}
