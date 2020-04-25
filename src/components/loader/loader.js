import React from 'react';
import BeatLoader from "react-spinners/BeatLoader";

const Loader = () => {
    return (<div className="sweet-loading">
    <BeatLoader
      size={20}
      color={"#000"}
      loading={true}
    />
  </div>);
}

export default Loader;