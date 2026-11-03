import { StyleSheet, View } from "react-native";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";

export default function OrdersScreen({
  orders,
  bouquetId,
  onChangeBouquet,
  onAdd,
  onToggle,
  onDelete,
}) {
  return (
    <View style={styles.container}>
      <OrderForm
        bouquetId={bouquetId}
        onChangeBouquet={onChangeBouquet}
        onAdd={onAdd}
      />
      <OrderList orders={orders} onToggle={onToggle} onDelete={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
