import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation'
import * as sessionActions from './store/session'
import ViewProducts from './components/Product/ProductList'
import ProductDetails from './components/Product/ProductDetails'
import CreateProductForm from './components/Product/CreateProductForm'

function Layout() {
  const dispatch = useDispatch()
  const [ isLoaded, setIsLoaded ] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <h1>Welcome!</h1> },
      {path: 'products',  element: <ViewProducts />},
      {path: 'products/:id',  element: <ProductDetails />},
      {path: "products/new", element: <CreateProductForm />},
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
