import React from 'react';
const Progress = ({showProgress}) => {
    return ( <div className="circular">
    {showProgress &&  
    <React.Fragment>
    <div className="inner"></div>
    <div className="circle">
       <div className="bar left">
          <div className="progress"></div>
       </div>
       <div className="bar right">
          <div className="progress"></div>
       </div>
     </div>
     </React.Fragment>
    }
  </div> );
}
 
export default Progress;