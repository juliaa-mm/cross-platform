import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const TABS = [
  { key: "home", label: "Головна", icon: "home-outline" },
  { key: "catalog", label: "Каталог", icon: "flower-outline" },
  { key: "orders", label: "Замовлення", icon: "cart-outline" },
];

export default function TabBar({ active, onChange, ordersCount }) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.wrapper}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onChange(tab.key)}
            >
              <Ionicons
                  name={tab.icon}
                  size={24}
                  color={isActive ? "#d9718f" : "#8a6e76"}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
              {tab.key === "orders" && ordersCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{ordersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f5dce3",
  },
  row: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  tabActive: {
    borderTopColor: "#d9718f",
  },
  icon: {
    fontSize: 22,
  },
  iconInactive: {
    opacity: 0.5,
  },
  label: {
    fontSize: 12,
    color: "#8a6e76",
  },
  labelActive: {
    color: "#d9718f",
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: "25%",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#d9718f",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
});
