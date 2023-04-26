import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useEffect, useState } from "react";
import Home from "../screens/Home/Home";
import SignUp from "../screens/SignUp/SignUp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const MainNav = () => {
  const Stack = createNativeStackNavigator();
  const [routeName, setRouteName] = useState("Home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setRouteName("Home");
      } else {
        setRouteName("SignUp");
      }
    });
  }, [user]);

  return (
    <Stack.Navigator
      initialRouteName={routeName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default MainNav;
