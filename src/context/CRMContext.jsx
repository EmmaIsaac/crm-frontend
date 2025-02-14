import React, { useState } from "react";

const CRMContext = React.createContext([{}, () => {}]);

const CRMProvider = (props) => {
    // definir el state inicial
    const [auth, guardarAuth] = useState({
        token: "",
        auth: false,
    });

    return (
        <CRMContext.Provider value={[auth, guardarAuth]}>
            {
                // eslint-disable-next-line react/prop-types
                props.children
            }
        </CRMContext.Provider>
    );
};

export { CRMContext, CRMProvider };
