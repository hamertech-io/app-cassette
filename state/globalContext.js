import * as React from "react";
import { fetchCassette } from "../api";

const initialState = {
  episodes: {},
  series: [],
  isLoading: true,
};

const GlobalContext = React.createContext(initialState);

const reducer = (prevState, action) => {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...prevState,
        episodes: action.payload.episodes,
        series: action.payload.series,
        isLoading: false,
      };
  }
};

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const res = await fetchCassette();
        if (res.ok) {
          const data = await res.json();
          const episodes = data.episodes;
          const episodesObj = {};
          episodes.forEach((el) => {
            episodesObj[el.id] = el;
          });

          dispatch({
            type: "LOAD_DATA",
            payload: {
              episodes: episodesObj,
              series: data.series,
            },
          });
        }
      } catch (e) {
        console.log(e);
        return;
      }
    };

    bootstrapAsync();
  }, []);
  const actions = React.useMemo(
    () => ({
      actionHere: async () => {},
    }),
    []
  );

  const value = { state, actions };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => React.useContext(GlobalContext);
