import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function formatDate(date) {
  return date.split("-").reverse().join(".");
}

export default function OrderItem({ order, onToggle, onDelete }) {
  return (
    <View style={[styles.item, order.done && styles.itemDone]}>
      <TouchableOpacity style={styles.textWrapper} onPress={() => onToggle(order.id)}>
        <Text style={[styles.title, order.done && styles.textDone]}>
          {order.bouquetName} · {order.price} грн
        </Text>
        <Text style={[styles.info, order.done && styles.textDone]}>
          Отримувач: {order.recipient}
        </Text>
        <Text style={[styles.info, order.done && styles.textDone]}>
          Дата доставки: {formatDate(order.date)}
        </Text>
        {order.card !== "" && (
          <Text style={[styles.info, order.done && styles.textDone]}>
            Листівка: {order.card}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(order.id)}>
        <Text style={styles.deleteText}>Видалити</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fce9ee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  itemDone: {
    backgroundColor: "#d1fae5",
  },
  textWrapper: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3b2e33",
  },
  info: {
    fontSize: 13,
    color: "#3b2e33",
  },
  textDone: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  deleteButton: {
    backgroundColor: "#f43f5e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
