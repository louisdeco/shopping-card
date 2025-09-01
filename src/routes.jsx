import Layout from './components/Layout';
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
            }
        ]
    },
]