import React from 'react';

import './style.css';

interface Props {
    Text: string,
    corPlanoFundo:string
}
function Message (props: Props) {
    const {Text, corPlanoFundo} = props;
    return(
        <div className="Message" style={{background:`${corPlanoFundo}`}}>
            <div className="content-message">
                <h1>{Text}</h1>
            </div>
        </div>
    )
}

export default Message;