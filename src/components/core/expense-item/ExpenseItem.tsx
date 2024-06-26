import { Expense, Person } from '../../../models';
import './ExpenseItem.css';
import { IonButton, IonIcon, useIonAlert } from '@ionic/react';
import { create, trashBinOutline } from 'ionicons/icons';
import useExpenseStore from '../../../store/expense/expense.store';

interface ExpenseItemProps {
    expense: Expense,
    onEditClick: any,
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
    expense,
    onEditClick
}) => {
    const [presentAlert] = useIonAlert();
    const removeExpense = useExpenseStore((state) => state.removeExpense);

    const onDelete = () => {
        presentAlert({
            message: `Are you sure you want to delete ${expense.title}?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    handler: () => {
                        removeExpense(expense);
                    }
                }
            ]

        })
    }

    return (
        <div className='expense-item-wrapper'>
            <div className='expense-title'>
                <div>{expense.title}</div>
                <div className='expense-actions'>
                    <IonButton fill='clear' color='primary' size='small' onClick={(e) => onEditClick(expense)}>
                        <IonIcon icon={create}></IonIcon>
                    </IonButton>
                    <IonButton fill='clear' color='danger' size='small' onClick={onDelete}>
                        <IonIcon icon={trashBinOutline}></IonIcon>
                    </IonButton>
                </div>
            </div>
            <div className='expense-amount'>Amount: <span className='amount-value'>P {expense.amount}</span></div>
            {
                expense.payer_id !== 'all' &&
                <div className='expense-payer'>Payer: {expense?.payer?.name}</div>
            }
            <div className='expense-breakdown'>
                {
                    expense.contributors.map((item: Person, index: number) => (
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