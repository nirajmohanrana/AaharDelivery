import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

import * as Location from "expo-location";

import MapViewDirections from "react-native-maps-directions";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import OrderCard from "./OrderCard";
import HandleStatus from "./HandleStatus";

const Home = () => {
  const [location, setLocation] = useState(null);

  const [orders, setOrders] = useState(null);

  const [showRoute, setShowRoute] = useState(false);

  const [accepted, setAccepted] = useState(false);

  const [OrderId, setOrderId] = useState(null);

  const [RasoiLat, setRasoiLat] = useState(null);
  const [RasoiLong, setRasoiLong] = useState(null);
  const [UserLat, setUserLat] = useState(null);
  const [UserLong, setUserLong] = useState(null);

  useEffect(() => {
    const getPermissions = async () => {
      Location.requestForegroundPermissionsAsync();
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Please Grant");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync();
      setLocation(currentLocation);
      console.log(location);
    };

    getPermissions();
  }, []);

  // FOR ORDERS
  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const qOrders = query(ordersRef, where("orderStatus", "==", 1));

    const unsubscribeOrders = onSnapshot(qOrders, (querySnapshot) => {
      const ordersData = [];

      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });

      setOrders(ordersData);
    });

    return () => {
      unsubscribeOrders();
    };
  }, []);

  const GOOGLE_MAPS_APIKEY = "AIzaSyBqXPoD7q3vpxLtnMpclh4u0GLXcUjmlvw";
  const origin = { latitude: 37.3318456, longitude: -122.0296002 };
  const destination = { latitude: 37.771707, longitude: -122.4053769 };

  return (
    <View style={styles.homeCon}>
      <View style={styles.map}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location ? location.latitude : 19.445727,
            longitude: location ? location.longitude : 72.80533,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          <Marker
            key={1}
            coordinate={{
              latitude: location ? location.latitude : 19.445727,
              longitude: location ? location.longitude : 72.80533,
            }}
            title={"You Are Here"}
          />

          {RasoiLat && showRoute ? (
            <Marker
              key={2}
              coordinate={{
                latitude: UserLat ? UserLat : 19.459722,
                longitude: UserLong ? UserLong : 72.80867,
              }}
              title={"RASOI"}
            />
          ) : (
            ""
          )}

          {UserLat && showRoute ? (
            <Marker
              key={3}
              coordinate={{
                latitude: UserLat ? UserLat : 19.459722,
                longitude: UserLong ? UserLong : 72.80867,
              }}
              title={"USER"}
            />
          ) : (
            ""
          )}

          {showRoute ? (
            <MapViewDirections
              origin={{
                latitude: location ? location.latitude : 19.445727,
                longitude: location ? location.longitude : 72.80533,
              }}
              destination={{
                latitude: UserLat ? UserLat : 19.459722,
                longitude: UserLong ? UserLong : 72.80867,
              }}
              waypoints={[
                {
                  latitude: RasoiLat ? RasoiLat : 19.459479,
                  longitude: RasoiLong ? RasoiLong : 72.801456,
                },
              ]}
              strokeWidth={3}
              strokeColor="#f97316"
              apikey={GOOGLE_MAPS_APIKEY}
            />
          ) : (
            ""
          )}
        </MapView>
      </View>

      <View style={styles.bottomSheet}>
        {!accepted ? (
          <View>
            <Text style={styles.bottomText}>Available Orders</Text>
            <FlatList
              data={orders}
              renderItem={({ item }) => {
                return (
                  <OrderCard
                    item={item}
                    setRasoiLat={setRasoiLat}
                    setRasoiLong={setRasoiLong}
                    setUserLat={setUserLat}
                    setUserLong={setUserLong}
                    setShowRoute={setShowRoute}
                    setAccepted={setAccepted}
                    setOrderId={setOrderId}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View>
            <HandleStatus OrderId={OrderId} setAccepted={setAccepted} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeCon: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "45%",
  },
  bottomSheet: {
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "#f97316",
  },
  bottomText: {
    textAlign: "center",
    marginVertical: 5,
    padding: 5,
    fontSize: 16,
    fontWeight: 700,
    borderBottomWidth: 0.2,
    borderColor: "gray",
  },
});
