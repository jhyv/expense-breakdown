import { useState } from 'react';
import { Expense, Person } from '../../../models';
import './ExpenseItem.css';

interface ExpenseItemProps {
    expense: Expense
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
    expense
}) => {

    const getBreakdown = () => {
        if (expense.payer_id !== 'all') {
            const contribution = expense.amount / (expense.contributors.length + 1);

            return expense.contributors.map((item: Person) => ({
                ...item,
                contribution
            }));
        } else {
            const contribution = expense.amount / (expense.contributors.length);

            return expense.contributors.map((item: Person) => ({
                ...item,
                contribution
            }));
        }
    }

    const [breakdown, setBreakdown] = useState<any[]>(getBreakdown());

    return (
        <div className='expense-item-wrapper'>
            <div className='expense-title'>{expense.title}</div>
            <div className='expense-amount'>Amount: <span className='amount-value'>P {expense.amount}</span></div>
            {
                expense.payer_id !== 'all' &&
                <div className='expense-payer'>Payer: {expense?.payer?.name}</div>
            }
            <div className='expense-breakdown'>
                {
                    breakdown.map((item: Person, index: number) => (
                        <div key={`breakdown-item-${index}${expense.id}`} className='expense-breakdown-item'>
                            <div>
                                <div></div>
                                <div>
                                    {item.name}
                                </div>
                            </div>
                            <div>
                                P {item.contribution?.toFixed(2)}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}