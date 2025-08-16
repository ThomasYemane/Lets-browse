import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import { restoreUser } from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreUser()).finally(() => setIsLoaded(true));
  }, [dispatch]);

  return isLoaded ? <Outlet /> : null;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <h1>Welcome!</h1> },
      { path: '/login', element: <LoginFormPage /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
