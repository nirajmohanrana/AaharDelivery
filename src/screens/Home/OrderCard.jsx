import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const OrderCard = ({
  item,
  setRasoiLat,
  setRasoiLong,
  setUserLat,
  setUserLong,
  setShowRoute,
  setAccepted,
  setOrderId,
}) => {
  const [RasoiAddress, setRasoiAddress] = useState("");
  const [RasoiLatTemp, setRasoiLatTemp] = useState(null);
  const [RasoiLongTemp, setRasoiLongTemp] = useState(null);

  useEffect(() => {
    async function getRasoiDetails() {
      const rasoiRef = doc(db, "rasoi-users", item.rasoiId);
      const raosiSnap = await getDoc(rasoiRef);

      const rasoiDetails = raosiSnap.data();

      setRasoiAddress(rasoiDetails.formattedAddress);
      setRasoiLatTemp(rasoiDetails.latitude);
      setRasoiLongTemp(rasoiDetails.longitude);
    }

    getRasoiDetails();
  }, [item]);

  async function handleLocate() {
    console.log("locate");
    setShowRoute(true);
    setUserLat(item.userLocation.lat);
    setUserLong(item.userLocation.lng);
    setRasoiLat(RasoiLatTemp);
    setRasoiLong(RasoiLongTemp);
  }

  async function handleAccept() {
    setOrderId(item.orderId);
    console.log(item.orderId);
    const orderRef = doc(db, "orders", item.orderId);
    await updateDoc(orderRef, {
      orderStatus: 2,
    });
    setAccepted(true);
  }

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        margin: 10,
      }}
    >
      <View style={{ flexDirection: "row", padding: 10 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 1999,
            backgroundColor: "#f97316",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 700, color: "white" }}>
            {item
              ? item.userName
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
                  .toUpperCase()
              : ""}
          </Text>
        </View>
        <View style={{ width: "80%" }}>
          {/* USER NAME */}
          <Text style={{ fontStyle: "italic", fontWeight: 300 }}>
            Deliever To:{" "}
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {item?.userName}
            </Text>
          </Text>

          {/* USER ADDRESS */}
          <Text
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 11,
              marginBottom: 2,
              borderBottomWidth: 0.3,
            }}
          >
            {item?.userFormattedAddress}
          </Text>

          {/* RASOI NAME */}
          <Text
            style={{
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Pick From:{" "}
            <Text
              style={{
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {item?.rasoiName}
            </Text>
          </Text>

          {/* RASOI ADDRESS */}
          <Text
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 12,
            }}
          >
            {RasoiAddress}
          </Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4e95ff",
            padding: 5,
            gap: 5,
          }}
          onPress={() => {
            handleLocate();
          }}
        >
          <Ionicons name="locate" size={18} color="#0049b8" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#0049b8",
            }}
          >
            Locate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4eff98",
            padding: 5,
            gap: 5,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => {
            handleAccept();
          }}
        >
          <Ionicons
            name="ios-checkmark-done-circle"
            size={18}
            color="#006e2e"
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#006e2e",
            }}
          >
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderCard;
