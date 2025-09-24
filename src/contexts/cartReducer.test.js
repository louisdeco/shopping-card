import { describe, it, expect } from 'vitest';
import { cartReducer, initialCart } from './cartReducer';

describe('cartReducer', () => {
    it('adds a new item to the start', () => {
        const action = { type: 'added', id: 1, size: 'M', quantity: 1 };
        const state = cartReducer(initialCart, action);

        expect(state).toStrictEqual([{ id: 1, size: 'M', quantity: 1 }]);
    });

    it('increments quantity if item already exists', () => {
        const state = [{ id: 1, size: 'M', quantity: 1 }];
        const action = { type: 'added', id: 1, size: 'M', quantity: 1 };

        const newState = cartReducer(state, action);
        expect(newState).toStrictEqual([{ id: 1, size: 'M', quantity: 2 }]);
    });

    it('adds separate item for different size of same product', () => {
        const state = [{ id: 1, size: 'M', quantity: 1 }];
        const action = { type: 'added', id: 1, size: 'XL', quantity: 1 };

        const newState = cartReducer(state, action);
        expect(newState).toStrictEqual([{ id: 1, size: 'M', quantity: 1 }, { id: 1, size: 'XL', quantity: 1 }]);
    });

    it('deletes an item by id and size', () => {
        const state = [{ id: 1, size: 'M', quantity: 1 }, { id: 1, size: 'XL', quantity: 1 }];
        const action = { type: 'delete', id: 1, size: 'M' };

        const newState = cartReducer(state, action);
        expect(newState).toStrictEqual([{ id: 1, size: 'XL', quantity: 1 }]);
    });

    it('deletes only matching id and size combination', () => {
        const state = [
            { id: 1, size: 'M', quantity: 1},
            { id: 2, size: 'M', quantity: 1}
        ]
        const action = { type: 'delete', id: 1, size: 'M'};

        const newState = cartReducer(state, action);
        expect(newState).toStrictEqual([{ id: 2, size: 'M', quantity: 1}])
    })

    it('throws on unknown action type', () => {
        expect(() => cartReducer([], { type: 'bogus' })).toThrow('Unknown action: bogus');
    });
});