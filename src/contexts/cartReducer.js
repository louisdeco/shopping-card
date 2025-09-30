export function cartReducer(state, action) {
    switch (action.type) {
        case 'added': {
            const existingItemIndex = state.findIndex(item => item.id === action.id && item.size === action.size);

            if (existingItemIndex >= 0) return state.map((item, index) => index === existingItemIndex ? {...item, quantity: item.quantity + action.quantity } : item);
            else return [
                ...state, {
                    id: action.id,
                    size: action.size,
                    quantity: action.quantity,
                    price: action.price
                }
            ];
        }

        case 'delete': {
            return state.filter(item => !(item.id === action.id && item.size === action.size));
        }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const initialCart = [];