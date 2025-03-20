import React from 'react';

const Quotation = ({ quote }) => {
    return (
        <tr key={quote._id}>
            {/* <td>{quote._id}</td> */}
            <td>{new Date(quote.date).toLocaleDateString()}</td>
            <td>{quote.customerId.name}</td>
            <td>{quote.customerId.code}</td>
            <td>{quote.quoteStatus}</td>
            <td>{quote.customerId.customerPaymentMethodId.customer_payment_description}</td>
            <td>{quote.currency}</td>
            <td>{quote.isKit ? 'Sí' : 'No'}</td>
        </tr>
    );
};

export default Quotation;
