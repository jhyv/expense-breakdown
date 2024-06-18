import { IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';
import './ExpenseModal.css';
import { AppLayout } from '../../layout/AppLayout';
import { useState } from 'react';
import { CommonModal, Expense, Person } from '../../../models';

interface ExpenseModalProps extends CommonModal {
    isEdit?: boolean;
    payers?: Person[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ state, setState, isEdit }) => {
    const [form, setForm] = useState<Expense>({
        title: '',
        type: '',
        amount: 0,
        contributors: [],
        payer_id: '',
        transaction_id: ''
    });

    const onInputChange = (e: any, input: string) => {
        setForm((oldVal) => ({ ...oldVal, [input]: e.target.value }));
    }

    return (
        <IonModal isOpen={state}>
            <AppLayout
                classes={['no-border']}
                hasCloseBtn
                title={isEdit ? 'Edit Expense' : 'Add Expense'}
                onCloseClick={() => setState(false)}>
                <div className='form-container'>
                    <IonItem>
                        <IonLabel>Title</IonLabel>
                        <IonInput type='text' value={form.title} onChange={(e) => onInputChange(e, 'title')} />
                    </IonItem>
                </div>
            </AppLayout>
        </IonModal>
    );
}