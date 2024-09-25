import { useState, useEffect } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"


const saveApprovalState = (transactionId, approved) => {
  const approvals = JSON.parse(localStorage.getItem("approvals")) || {};
  approvals[transactionId] = approved;
  localStorage.setItem("approvals", JSON.stringify(approvals));
}

const getApprovalState = (transactionId) => {
  const approvals = JSON.parse(localStorage.getItem("approvals")) || {};
  return approvals[transactionId];
}

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(getApprovalState(transaction.id) ?? transaction.approved);

  useEffect(() => {
    setApproved(getApprovalState(transaction.id) ?? transaction.approved);
  }, [transaction.id]);

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          })

          setApproved(newValue);
          saveApprovalState(transaction.id, newValue); 
        }}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
