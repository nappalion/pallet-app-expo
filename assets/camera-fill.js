import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { TouchableOpacity } from "react-native";

const CameraIcon = (props) => (
  <TouchableOpacity {...props}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={35}
      height={35}d
    >
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path
        d="M9 3h6l2 2h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4l2-2zm3 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
        fill="rgba(93,85,115,1)"
      />
    </Svg>
  </TouchableOpacity>
);

export default CameraIcon;