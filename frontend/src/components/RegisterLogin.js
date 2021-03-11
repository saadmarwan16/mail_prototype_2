import React from 'react'

const RegisterLogin = ({ formDetails, submitValue, onSubmit }) => {
    return (
        <>
            <form method="post" onSubmit={onSubmit}>
                {formDetails.map((item, index) => {
                    return (
                        <div className="form-group">
                            <input key={index} autoFocus={item.isAutoFocus} 
                                className="form-control register-login-input" type={item.type} 
                                placeholder={item.placeholder} value={item.value} onChange={item.onChange}
                            />
                        </div>
                    )
                })}
                
                <input className="btn btn-primary register-login-submit-btn" type="submit" 
                    value={submitValue} 
                />
            </form>
        </>
    )
}

export default RegisterLogin