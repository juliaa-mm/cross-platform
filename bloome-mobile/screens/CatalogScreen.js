import { FlatList, StyleSheet, Text } from "react-native";
import BouquetCard from "../components/BouquetCard";
import { BOUQUETS } from "../data/bouquets";

export default function CatalogScreen({ onOrder }) {
  return (
    <FlatList
      data={BOUQUETS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Каталог квітів</Text>}
      renderItem={({ item }) => (
        <BouquetCard bouquet={item} onOrder={onOrder} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3b2e33",
    marginBottom: 12,
  },
});
