// import React from 'react'
// import "./Table.css"
// function Table({countries}) {
//     return (
//         <div className="table">
//             {countries.map(({country, cases}) => (
//                 <tr>
//                     <td>{country}</td>
//                     <td>
//                         <strong>{cases}</strong>
//                     </td>
//                 </tr>
//             ))}
//         </div>
//     )
// }

// export default Table
import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((country, i) => (
        <tr key={i}>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;

// countries.map((country, i), map automatically generates an index i for every item