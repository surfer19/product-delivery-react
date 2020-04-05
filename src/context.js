
import React, { useReducer, createContext } from "react";

export const ContactContext = createContext();

const initialState = {
  count: 0,
  basket: [],
  totalPrice: 0,
  contacts: {},
  deliveryType: 'NA_PREDAJNI'
};

const reducer = (state, action) => {
  switch (action.type) {
		case "ADD_TO_BASKET":
			// console.log('action', action)
			// console.log('state.',state)
			// console.log('basket: [...state.basket, action.payload]', {basket: [...state.basket, action.payload]})
			return {
				...state,
				basket: [...state.basket, action.payload]
			}
		case "REMOVE_FROM_BASKET":
			return {
				...state,
				basket: [...state.basket.find(item => {
					return item.ProductID === action.payload
				})]
			}
		case "RECALCULATE_TOTAL_PRICE":
			return {
				...state,
				totalPrice: state.basket.map(item => item.Price)
					.reduce((prev, next) => parseFloat(prev) + parseFloat(next)),
			}
		case "SEND_PERSONAL_FORM":
			return {
				...state,
				...action.payload,
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