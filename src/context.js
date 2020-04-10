
import React, {useReducer, createContext } from "react";
import { findIndex, propEq } from "ramda";

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
			return {
				...state,
				basket: [...state.basket, action.payload]
			}
		case "REMOVE_FROM_BASKET":
			const basketItems = [...state.basket]
			const idx = findIndex(propEq('ProductID', action.payload))(basketItems);
			if (idx === -1) {
				return {
					...state
				}
			}
			basketItems.splice(idx, 1);
			return {
				...state,
				basket: basketItems
			}

		case "RECALCULATE_TOTAL_PRICE":
			return {
				...state,
				totalPrice: state.basket.map(item => item.Price)
					.reduce((prev, next) => (parseFloat(prev) + parseFloat(next)).toFixed(2), 0),
			}
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