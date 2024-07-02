import { IonButton, IonCol, IonInput, IonItem, IonLabel, IonModal, IonRow } from '@ionic/react';
import { CommonModalProps, Group } from '../../../models';
import './GroupModal.css';
import { AppLayout } from '../../layout/AppLayout';
import { useState } from 'react';
import { GROUP_ICON_LIST } from '../../../constants';
import useGroupStore from '../../../store/group/group.store';

interface GroupModalProps extends CommonModalProps {

}

export const GroupModal: React.FC<GroupModalProps> = ({
    state,
    isEdit,
    setState
}) => {
    const saveGroup = useGroupStore((state) => state.saveGroup);
    const [form, setForm] = useState<Group>({
        title: '',
        icon: null
    });

    const onInputChange = (value: any, input: string) => {
        console.log('[onInputChange] value', value);
        setForm((oldVal) => ({
            ...oldVal,
            [input]: value
        }));
    }
    const onClose = () => {
        setState(false);
    }

    const onFormSubmit = () => {
        if (form.title && form.icon) {
            saveGroup(form);
            onClose();
        }
    }

    return (
        <IonModal isOpen={state}>
            <AppLayout
                classes={['no-border']}
                hasCloseBtn
                title={isEdit ? 'Edit Breakdown' : 'Add Breakdown'}
                onCloseClick={onClose}>
                <form onSubmit={onFormSubmit}>
                    <div className='form-container'>
                        <IonItem>
                            <IonLabel position='floating'>Title</IonLabel>
                            <IonInput type='text' value={form.title} onIonInput={(e: any) => onInputChange(e.target.value, 'title')} required />
                        </IonItem>
                        <br />
                        <IonItem lines='none'>
                            <IonLabel>Select Icon</IonLabel>
                        </IonItem>
                        <div className='icon-input-list'>
                            {
                                GROUP_ICON_LIST.map((item, index) => (
                                    <div key={`groupIconInput${index}`} className={`icon-item ${item.key === form.icon && 'active'}`} onClick={() => onInputChange(item.key, 'icon')}>
                                        {item.icon()}
                                    </div>
                                ))
                            }
                        </div>

                        <IonRow className='ion-justify-content-end'>
                            <IonCol size='5'>
                                <IonButton type='submit' expand='block'>
                                    Submit
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </form>
            </AppLayout>
        </IonModal>
    );
}