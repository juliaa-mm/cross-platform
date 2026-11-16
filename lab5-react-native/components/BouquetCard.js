import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BouquetCard({ bouquet, onOrder }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: bouquet.image }} style={styles.photo} />
      <View style={styles.body}>
        <Text style={styles.badge}>{bouquet.flowers}</Text>
        <Text style={styles.name}>{bouquet.name}</Text>
        <Text style={styles.price}>{bouquet.price} грн</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onOrder(bouquet.id)}
        >
          <Text style={styles.buttonText}>Замовити</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  photo: {
    width: "100%",
    height: 190,
    backgroundColor: "#fce9ee",
  },
  body: {
    padding: 14,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#fbe4ea",
    color: "#b8567a",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a2e3a",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d9718f",
    marginTop: 2,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#d9718f",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
