import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Main from "./screens/MainComponent";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </Provider>
  );
}
