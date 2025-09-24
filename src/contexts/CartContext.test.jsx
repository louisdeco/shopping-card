import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider, useCart, useCartDispatch } from './CartContext';
import userEvent from '@testing-library/user-event';

// Test component that uses the context
function TestComponent() {
    const cart = useCart();
    const dispatch = useCartDispatch();

    const addItem = () => {
        dispatch({
            type: 'added',
            id: '123',
            size: 'M',
            quantity: 1
        });
    };

    const deleteItem = () => {
        dispatch({
            type: 'delete',
            id: '123',
            size: 'M'
        });
    }

    return (
        <div>
            <div data-testid="cart-count">{cart.length}</div>
            <div data-testid="cart-contents">{JSON.stringify(cart)}</div>
            <button onClick={addItem} data-testid="add-button">Add Item</button>
            <button onClick={deleteItem} data-testid="delete-button">Delete Item</button>
        </div>
    );
}

describe('CartContext', () => {
    it('provides initial cart state', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-contents')).toHaveTextContent([]);
    });

    it('updates state when dispatching an action', async () => {
        const user = userEvent.setup();

        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        await user.click(screen.getByText('Add Item'));
        expect(screen.getByTestId('cart-contents')).toHaveTextContent(
            JSON.stringify([{ id: '123', size: 'M', quantity: 1 }])
        );

        await user.click(screen.getByText('Delete Item'));
        expect(screen.getByTestId('cart-contents')).toHaveTextContent([]);
    });
})