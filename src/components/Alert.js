import React from 'react'

function Alert(props) {
    const cap = (word) => {
        if(word === "danger") {
            word = "error"
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return (
        <div style={{height: '50px'}}>
        {props.alert && <div className={`alert alert-${props.alert.type} alert-dissmisable fade show`} role="alert">
            <strong>{cap(props.alert.type)}</strong>: {props.alert.msg}
        </div>}
        </div>
    )
}

export default Alert


