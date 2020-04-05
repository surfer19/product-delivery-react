import React, {createContext, useReducer} from "react";

export const ContactContext = createContext();

const initialState = {
    count: 0,
    basket: [],
    totalPrice: 0,
    personalData: {},
    deliveryType: 'NA_PREDAJNI'
};

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_BASKET":
            const basketItems = [...state.basket];
            const productInBasket = basketItems.find(product => product.ProductID === action.payload.ProductID);
            if (productInBasket) {
                productInBasket.Count += 1;
            } else {
                action.payload.Count = 1;
                basketItems.push(action.payload);
            }
            return {
                ...state,
                basket: basketItems
            };
        case "REMOVE_FROM_BASKET":
            let rmBasketItems =[...state.basket];
            const rmProductInBasket = rmBasketItems.find(product => product.ProductID === action.payload);
            if (rmProductInBasket.Count === 1) {
                rmBasketItems = rmBasketItems.filter(product => product.ProductID !== action.payload)
            } else {
                rmProductInBasket.Count -= 1;
            }
            return {
                ...state,
                basket: rmBasketItems
            };
        case "RECALCULATE_TOTAL_PRICE":
            return {
                ...state,
                totalPrice: state.basket.map(item => parseFloat(item.Price) * item.Count).reduce((prev, next) => prev + next)
            };
        case "SEND_PERSONAL_FORM":
            return {
                ...state,
                personalData: {...action.payload},
            };

        case "UPDATE_DELIVERY":
            return {
                ...state,
                deliveryType: action.payload
            };

        default:
            throw new Error();
    }
};

export const ContactContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ContactContext.Provider value={[state, dispatch]}>
            {props.children}
        </ContactContext.Provider>
    );
};
