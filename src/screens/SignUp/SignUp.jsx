import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";

const AuthScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const [prompt, setPrompt] = useState(
    "Please Provider Country\nlike +91 for India"
  );
  const [promptStyle, setPromptStyle] = useState({
    fontWeight: 300,
    color: "gray",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home");
      } else {
        console.log("Not Signed In");
      }
    });
  }, [user]);

  const handleSubmitUser = async () => {
    setIsLoading(true);
    if (!/^\+\d+$/g.test(phoneNumber)) {
      Alert.alert("Please enter a valid phone number with country code.");
      setIsLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Sign Up", user);

        updateProfile(auth.currentUser, {
          displayName: userName,
          phoneNumber: phoneNumber,
        })
          .then(() => {
            console.log("Profile updated!");
          })
          .catch((error) => {
            console.log("update error", error);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setPrompt(errorMessage);
      });

    setIsLoading(false);
    setPrompt("Please Enter OTP\nSent to your given number");
    setPromptStyle({
      fontWeight: 500,
      color: "#000",
    });

    setEmail("");
    setPassword("");
    setShowPasswordInput(true);
  };

  const handleSubmitSignIn = async () => {
    try {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUser(userCredential);
          console.log("Sign In", user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          setPrompt(errorMessage);
        });
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      setIsLoading(true);
      setPrompt("Please Enter Correct Password\nOr Else Please Try Again");
      setPromptStyle({
        fontWeight: 800,
        color: "#f00",
      });
      setIsLoading(false);
    }
  };

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.detailsCon}>
      {!showPasswordInput && (
        <>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName
                ? userName
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()
                : "आहार"}
            </Text>
          </View>
          <View style={styles.inputCon}>
            <TextInput
              placeholder="Your Name"
              keyboardType="default"
              value={userName}
              onChangeText={setUserName}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              maxLength={13}
              onChangeText={setPhoneNumber}
              style={styles.input}
            />
            <TextInput
              placeholder="Pasword"
              keyboardType="default"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <TouchableOpacity
              disabled={isLoading || email === "" || password == ""}
              style={styles.submitBtn}
              onPress={handleSubmitUser}
            >
              {isLoading ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <MaterialCommunityIcons
                    name="dots-circle"
                    size={16}
                    color="#fff"
                  />
                </Animated.View>
              ) : (
                <Text style={styles.submitBtnText}>SignUp</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
      {showPasswordInput && (
        <View style={styles.inputCon}>
          <TextInput
            placeholder="Email"
            keyboardType="default"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            keyboardType="default"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity
            disabled={isLoading || email === "" || password == ""}
            style={styles.submitBtn}
            onPress={handleSubmitSignIn}
          >
            {isLoading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <MaterialCommunityIcons
                  name="dots-circle"
                  size={16}
                  color="#fff"
                />
              </Animated.View>
            ) : (
              <Text style={styles.submitBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {/* Prompts && Errors*/}
      <TouchableOpacity>
        <Text
          style={[
            promptStyle,
            { marginVertical: 10, textAlign: "center", fontSize: 14 },
          ]}
        >
          {prompt}
        </Text>
      </TouchableOpacity>
      {showPasswordInput ? (
        <TouchableOpacity
          onPress={() => {
            setShowPasswordInput(false);
          }}
        >
          <Text style={{ color: "#00f", textDecorationLine: "underline" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      ) : (
        ""
      )}
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  detailsCon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#f97316",
    width: 80,
    height: 80,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    elevation: 4,
  },
  avatarText: {
    fontWeight: 900,
    fontSize: 30,
    color: "#fff",
    elevation: 4,
  },
  inputCon: {
    width: "75%",
  },
  input: {
    marginVertical: 10,
    backgroundColor: "#fff",
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 15,
  },
  submitBtn: {
    marginVertical: 10,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
  },
});
