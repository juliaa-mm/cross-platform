import { StyleSheet, Text, View } from "react-native";

export default function Header({ total, done, sum }) {
  return (
    <View style={styles.bar}>
      <Text style={styles.title}>Bloomé</Text>
      <Text style={styles.stats}>
        Усього замовлень: {total} · Доставлено: {done} · Сума: {sum} грн
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stats: {
    fontSize: 13,
    color: "#ffe4ec",
    marginTop: 2,
  },
});
