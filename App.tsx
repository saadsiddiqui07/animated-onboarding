import "react-native-gesture-handler";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SIZE = 70;

interface CircleProps {
  onPress: () => void;
  animatedValue: SharedValue<number>;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Circle = ({ onPress, animatedValue }: CircleProps) => {
  const inputRange = [0, 0.5, 1];

  const animatedCircleStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      animatedValue.value,
      inputRange,
      [0, -90, -180]
    );

    return {
      transform: [
        { perspective: 200 },
        { rotateY: `${rotateY}deg` },
        {
          scale: interpolate(animatedValue.value, inputRange, [1, 8, 1]),
        },
      ],
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 0.25, 0.5, 0.501, 1],
        ["#F5667A", "#F5667A", "#F5667A", "#1e3a8a", "#1e3a8a"]
      ),
    };
  });

  const animatedBG = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 0.25, 0.5, 0.501, 1],
        ["#1e3a8a", "#1e3a8a", "#1e3a8a", "#F5667A", "#F5667A"]
      ),
    };
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.circleContainer,
        animatedBG,
      ]}
    >
      <TouchableOpacity style={styles.btn}>
        <AntDesign name="setting" color={"white"} size={30} />
      </TouchableOpacity>
      <Animated.View style={[styles.circle, animatedCircleStyle]}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.circle, styles.circleButton]}>
            <AnimatedIcon
              name="chevron-forward-sharp"
              size={28}
              color={"white"}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default function App() {
  const animatedValue = useSharedValue(0);
  const [pressed, setPressed] = useState<boolean>(false);

  const animate = () => {
    setPressed(!pressed);
    animatedValue.value = pressed
      ? withTiming(0, {
          duration: 1500,
        })
      : withTiming(1, { duration: 1500 });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Circle onPress={animate} animatedValue={animatedValue} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
    paddingBottom: 100,
    // backgroundColor: "#1e3a8a",
  },
  circle: {
    backgroundColor: "#F5667A",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  circleButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    position: "absolute",
    top: 60,
    right: 30,
  },
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
