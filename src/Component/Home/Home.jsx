import React from 'react';
import Stocks from '../Stocks/Stocks';
import News from '../News/News';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faNewspaper } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 order-md-1">
          <h3 className="text-center text-color fw-bold mb-4"><FontAwesomeIcon   icon={faChartLine} className="me-2" />Stocks Dashboard</h3>
          <Stocks />
        </div>
        {/* عمود الأخبار */}
        <div className="col-md-4 order-md-2">
          <h2 className="text-center text-color mb-4" style={{ fontWeight: "700", fontSize: "1.8rem" }}>
            <FontAwesomeIcon icon={faNewspaper} className="me-2" />
              Market News
          </h2>
          <News isHomePage={true} />
        </div>

        {/* عمود الأسهم */}
        
      </div>
    </div>
  );
}
