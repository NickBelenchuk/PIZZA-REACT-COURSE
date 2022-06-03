import React from 'react';
import ContentLoader from 'react-content-loader';

const Skeleton = (props) => (
  <ContentLoader
    className="pizza-block"
    speed={2}
    width={280}
    height={480}
    viewBox="0 0 280 480"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}>
    <circle cx="135" cy="135" r="125" />
    <rect x="0" y="280" rx="10" ry="10" width="280" height="25" />
    <rect x="0" y="325" rx="10" ry="10" width="280" height="88" />
    <rect x="0" y="435" rx="10" ry="10" width="95" height="30" />
    <rect x="135" y="427" rx="20" ry="20" width="145" height="40" />
  </ContentLoader>
);

export default Skeleton;
