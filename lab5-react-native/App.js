import { useEffect, useState } from "react";
import { Alert, Keyboard, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import HomeScreen from "./screens/HomeScreen";
import CatalogScreen from "./screens/CatalogScreen";
import OrdersScreen from "./screens/OrdersScreen";
import { BOUQUETS } from "./data/bouquets";

// сьогоднішня дата у форматі РРРР-ММ-ДД
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// перевірка, що рядок є справжньою датою у форматі ДД.ММ.РРРР
function isValidDate(value) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
    return false;
  }
  const [day, month, year] = value.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
  );
}

function toIsoDate(value) {
  const [day, month, year] = value.split(".");
  return year + "-" + month + "-" + day;
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("home");
  const [bouquetId, setBouquetId] = useState(BOUQUETS[0].id);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // ховаємо нижнє меню, поки відкрита клавіатура
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // кнопка «Замовити» в каталозі: обираємо букет і відкриваємо вкладку замовлень
  function orderBouquet(id) {
    setBouquetId(id);
    setTab("orders");
  }

  function addOrder({ recipient, date, card }) {
    const recipientText = recipient.trim();
    const dateText = date.trim();

    if (recipientText === "") {
      Alert.alert("Помилка", "Будь ласка, вкажіть ім'я отримувача.");
      return false;
    }
    if (dateText === "") {
      Alert.alert("Помилка", "Будь ласка, вкажіть дату доставки.");
      return false;
    }
    if (!isValidDate(dateText)) {
      Alert.alert("Помилка", "Введіть дату у форматі дд.мм.рррр.");
      return false;
    }
    const isoDate = toIsoDate(dateText);
    if (isoDate < getToday()) {
      Alert.alert("Помилка", "Дата доставки не може бути в минулому.");
      return false;
    }

    const bouquet = BOUQUETS.find((item) => item.id === bouquetId);
    const newOrder = {
      id: Date.now().toString(),
      bouquetName: bouquet.name,
      price: bouquet.price,
      recipient: recipientText,
      date: dateText,
      card: card.trim(),
      done: false,
    };

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
    Alert.alert("Успіх", "Замовлення успішно додано.");
    return true;
  }

  function toggleOrder(id) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, done: !order.done } : order
      )
    );
  }

  function deleteOrder(id) {
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
    Alert.alert("Видалення", "Замовлення видалено.");
  }

  const doneCount = orders.filter((order) => order.done).length;
  const sum = orders.reduce((total, order) => total + order.price, 0);

  let screen;
  if (tab === "home") {
    screen = (
      <HomeScreen
        onGoCatalog={() => setTab("catalog")}
        onGoOrders={() => setTab("orders")}
        onOrder={orderBouquet}
      />
    );
  } else if (tab === "catalog") {
    screen = <CatalogScreen onOrder={orderBouquet} />;
  } else {
    screen = (
      <OrdersScreen
        orders={orders}
        bouquetId={bouquetId}
        onChangeBouquet={setBouquetId}
        onAdd={addOrder}
        onToggle={toggleOrder}
        onDelete={deleteOrder}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <SafeAreaView edges={["top"]} style={styles.top}>
          <StatusBar barStyle="light-content" />
          <Header total={orders.length} done={doneCount} sum={sum} />
        </SafeAreaView>

        <View style={styles.content}>{screen}</View>

        {!keyboardVisible && (
          <TabBar active={tab} onChange={setTab} ordersCount={orders.length} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff5f7",
  },
  top: {
    backgroundColor: "#d9718f",
  },
  content: {
    flex: 1,
  },
});
