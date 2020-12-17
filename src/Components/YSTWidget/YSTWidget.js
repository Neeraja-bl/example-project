import React from "react";
import { useHistory } from 'react-router-dom';

export default function YSTWidegt(props) {

  const history = useHistory();
  const { ...rest } = props;

  if (!props.redirectURL) {
    history.push("/login");
  }

  return (
    <div>
      <iframe src={props.redirectURL} height="800px" width="100%" frameBorder="0" />
    </div>
  );
}
