import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
const HandleStatus = ({ OrderId, setAccepted }) => {
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    let order = null;
    const unsub = onSnapshot(doc(db, "orders", OrderId), (doc) => {
      order = doc.data();
      console.log(order.orderStatus);
      setOrderStatus(order.orderStatus);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (orderStatus === 4) {
      setAccepted(false);
    }
  }, [orderStatus]);

  async function handleOrderStatusif2() {
    const orderRef = doc(db, "orders", OrderId);
    await updateDoc(orderRef, {
      orderStatus: 3,
    });
  }

  async function handleOrderStatusif3() {
    const orderRef = doc(db, "orders", OrderId);
    await updateDoc(orderRef, {
      orderStatus: 4,
    });
  }

  return (
    <View>
      {orderStatus === 2 ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleOrderStatusif2();
          }}
        >
          <Text style={styles.buttonText}>Order Received?</Text>
        </TouchableOpacity>
      ) : orderStatus === 3 ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleOrderStatusif3();
          }}
        >
          <Text style={styles.buttonText}>Order Delivered</Text>
        </TouchableOpacity>
      ) : (
        ""
      )}
    </View>
  );
};

export default HandleStatus;

const styles = StyleSheet.create({
  button: {
    margin: 15,
    marginVertical: 20,
    padding: 15,
    textAlign: "center",
    backgroundColor: "#4eff98",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 900,
    textAlign: "center",
    color: "#006e2e",
  },
});
