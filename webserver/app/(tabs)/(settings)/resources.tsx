import React from "react";
import { FontAwesome } from "@expo/vector-icons";

interface DeviceResources {
  [key: string]: JSX.Element | null;
}

interface DeviceDescriptions {
  [key: string]: string;
}

export const deviceIcons: DeviceResources = {
  "Device 1": <FontAwesome name="bluetooth" size={24} color="blue" />,
  "Device 2": <FontAwesome name="mobile" size={24} color="green" />,
  // Add more device name to icon mappings here
};

export const deviceDescriptions: DeviceDescriptions = {
  "Device 1": "Unkown bluetoth Device",
  "Device 2": "Description for Device 2",
  // Add more device name to description mappings here
};
