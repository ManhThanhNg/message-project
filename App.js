import { StyleSheet, LogBox } from "react-native";
import StackNavigator from "./StackNavigator";
import { UserContext } from "./UserContext";

LogBox.ignoreAllLogs();
export default function App() {
  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '"#fff"',
    alignItems: "center",
    justifyContent: "center",
  },
});
