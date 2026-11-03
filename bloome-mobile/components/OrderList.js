import { FlatList, StyleSheet, Text, View } from "react-native";
import OrderItem from "./OrderItem";

export default function OrderList({ orders, onToggle, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Список замовлень</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>Замовлень поки немає. Додайте перше!</Text>
      ) : (
        <>
          <Text style={styles.hint}>
            Торкніться замовлення, щоб позначити його доставленим.
          </Text>
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <OrderItem order={item} onToggle={onToggle} onDelete={onDelete} />
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b2e33",
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: "#78716c",
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    color: "#78716c",
    marginTop: 12,
  },
});
