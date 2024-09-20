import { IonButton, IonCol, IonInput, IonItem, IonLabel, IonModal, IonRow, useIonViewWillLeave } from '@ionic/react';
import { CommonModalProps, Group } from '../../../models';
import './GroupModal.css';
import { AppLayout } from '../../layout/AppLayout';
import { useEffect, useState } from 'react';
import { GROUP_ICON_LIST } from '../../../constants';
import useGroupStore from '../../../store/group/group.store';

interface GroupModalProps extends CommonModalProps {
    group: Group | null
}

export const GroupModal: React.FC<GroupModalProps> = ({
    state,
    setState,
    group
}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const saveGroup = useGroupStore((state) => state.saveGroup);
    const updateGroup = useGroupStore((state) => state.updateGroup);
    const [form, setForm] = useState<Group>({
        id: '',
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
            if (isEdit) {
                updateGroup(form, form.id);
            } else {
                saveGroup(form);
            }
            onClose();
        }
    }

    useIonViewWillLeave(() => {
        resetForm();
    });

    const resetForm = () => {
        setForm((oldState) => {

            setIsEdit(false);
            return {
                id: '',
                title: '',
                icon: null
            };
        });
    }

    useEffect(() => {
        if (state) {
            if (group) {
                setForm(group);
                setIsEdit(true);
            } else {
                resetForm();
            }
        }
    }, [state]);

    return (
        <IonModal isOpen={state}>
            <AppLayout
                basePage
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
                                {
                                    isEdit ?
                                        <IonButton type='submit' expand='block'>
                                            Save
                                        </IonButton> :
                                        <IonButton type='submit' expand='block'>
                                            Submit
                                        </IonButton>
                                }
                            </IonCol>
                        </IonRow>
                    </div>
                </form>
            </AppLayout>
        </IonModal>
    );
}