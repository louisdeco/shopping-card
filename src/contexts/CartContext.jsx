import { createContext, useReducer, useContext } from 'react';
import { cartReducer, initialCart } from './cartReducer';

// Two separate context
const CartContext = createContext(null); // The current cart content
const CartDispatchContext = createContext(null); // Function that lets the component dispatch actions

// Cart Provider Component
export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, initialCart);

    return (
        <CartContext value={cart}>
            <CartDispatchContext value={dispatch}>
                {children}
            </CartDispatchContext>
        </CartContext>
    )
}

export function useCart() {
    return useContext(CartContext);
}

export function useCartDispatch() {
    return useContext(CartDispatchContext);
}

