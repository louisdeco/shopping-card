import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Shop from './pages/Shop';

export const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'shopping/:category',
                element: <Shop />
            },
            {
                path:'*',
                element: <NotFound />
            }
        ]
    },
]