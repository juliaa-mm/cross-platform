import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BouquetCard from "../components/BouquetCard";
import { BOUQUETS } from "../data/bouquets";

export default function HomeScreen({ onGoCatalog, onGoOrders, onOrder }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Квіти з доставкою</Text>
        <Text style={styles.heroText}>
          Оберіть букет, вкажіть дату й отримувача, а решту ми візьмемо на себе.
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.primary} onPress={onGoCatalog}>
            <Text style={styles.primaryText}>До каталогу</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={onGoOrders}>
            <Text style={styles.secondaryText}>Мої замовлення</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Популярні букети</Text>
      {BOUQUETS.map((bouquet) => (
        <BouquetCard key={bouquet.id} bouquet={bouquet} onOrder={onOrder} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  hero: {
    backgroundColor: "#fce9ee",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#b8567a",
    marginBottom: 6,
  },
  heroText: {
    fontSize: 15,
    color: "#3b2e33",
    marginBottom: 16,
  },
  heroButtons: {
    flexDirection: "row",
    gap: 10,
  },
  primary: {
    backgroundColor: "#d9718f",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#d9718f",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  secondaryText: {
    color: "#d9718f",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b2e33",
    marginBottom: 12,
  },
});
