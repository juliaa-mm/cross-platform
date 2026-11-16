import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BOUQUETS } from "../data/bouquets";

export default function OrderForm({ bouquetId, onChangeBouquet, onAdd }) {
  const [recipient, setRecipient] = useState("");
  const [date, setDate] = useState("");
  const [card, setCard] = useState("");

  function handleAdd() {
    const added = onAdd({ recipient, date, card });
    if (added) {
      setRecipient("");
      setDate("");
      setCard("");
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Додати замовлення</Text>

      <View style={styles.chips}>
        {BOUQUETS.map((bouquet) => {
          const selected = bouquet.id === bouquetId;
          return (
            <TouchableOpacity
              key={bouquet.id}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onChangeBouquet(bouquet.id)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {bouquet.name}
              </Text>
              <Text style={[styles.chipPrice, selected && styles.chipTextSelected]}>
                {bouquet.price} грн
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="Ім'я отримувача"
          value={recipient}
          onChangeText={setRecipient}
        />
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="Дата (дд.мм.рррр"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          value={date}
          onChangeText={setDate}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Текст листівки (необов'язково)"
        value={card}
        onChangeText={setCard}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Додати замовлення</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#fce9ee",
  },
  chipSelected: {
    backgroundColor: "#d9718f",
  },
  chipText: {
    fontSize: 12,
    textAlign: "center",
    color: "#3b2e33",
  },
  chipPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#b8567a",
    marginTop: 2,
  },
  chipTextSelected: {
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  half: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8b7c4",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#d9718f",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
