import { addOutline, closeOutline, createOutline, ellipsisVerticalOutline, trashBinOutline } from 'ionicons/icons';
import { AppLayout } from '../../components';
import './Groups.css';
import { GroupModal } from '../../components/modals/group-modal/GroupModal';
import { useEffect, useState } from 'react';
import useGroupStore from '../../store/group/group.store';
import { Group } from '../../models';
import { IonButton, IonIcon, IonItem, IonLabel, IonRippleEffect, IonThumbnail, useIonActionSheet, useIonAlert, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { GROUP_ICON_LIST } from '../../constants';
import { parseDate } from '../../utils';

interface GroupsProps { }

export const Groups: React.FC<GroupsProps> = () => {
    const [groupModal, setGroupModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
    const navigate = useIonRouter();
    const [present] = useIonActionSheet();
    const [alertPresent] = useIonAlert();
    const {
        groupList, setGroup, resetCurrentGroup, removeGroup } = useGroupStore(({ groupList, setGroup, resetCurrentGroup, removeGroup }) => ({ groupList, setGroup, resetCurrentGroup, removeGroup }));
    const btns = [
        {
            icon: addOutline,
            handler: () => {
                setGroupModal(oldValue => {
                    setCurrentGroup(null);

                    return true;
                });
            }
        }
    ];

    const authenticate = async () => {
        const apiUrl = "https://ws-capitalfinancialservices-uat.finpower.au/API/Authentication/AuthenticateUser";

        const credentials = {
            "subscriberId": "WEB",
            "userId": "WSWEB",
            "password": "idxqEgvfc2#",
            "hash": "UHRrhcy+Itmr9+5/No6uXvLAKFNj9TTU2/sUF+bnFiM=",
            "hashSalt": "UBJFAJTDFO"
        };


        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Frame-Options": "SAMEORIGIN",
                "Referrer-Policy": "no-referrer",
                "Cache-Control": "no-cache",
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        console.log("Authentication successful:", data);
    }


    const getIcon = (key: string) => {
        return GROUP_ICON_LIST.find(groupIcon => groupIcon.key === key)?.icon();
    }

    const onGroupItemClick = (group: Group) => {
        setGroup(group);
        navigate.push('/expense-breakdown');
    }

    const onOptionClick = (item: Group) => {
        present({
            header: 'Options',
            buttons: [
                {
                    icon: createOutline,
                    text: 'Edit',
                    handler: () => {
                        setCurrentGroup((oldVal) => {
                            setGroupModal(true);
                            return item;
                        });
                    }
                },
                {
                    icon: trashBinOutline,
                    text: 'Delete',
                    handler: () => {
                        alertPresent({
                            message: `Are you sure you want to delete ${item.title}?`,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel'
                                },
                                {
                                    text: 'Delete',
                                    handler: () => {
                                        removeGroup(item);
                                    }
                                },
                            ]
                        })
                    }
                },
                {
                    icon: closeOutline,
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        })
    }

    useIonViewDidEnter(() => {
        resetCurrentGroup();
        authenticate();

    }, []);


    useEffect(() => {
        console.log(groupList);
    }, [groupList])

    return (
        <AppLayout basePage title="List" customBtns={btns}>
            {
                groupList.map((group: Group, index) => (
                    <div className='ion-activatable ripple-parent group-item' key={`groupItem${group.id}${index}`}>
                        <div className='group-item-info' onClick={() => onGroupItemClick(group)}>
                            <IonThumbnail slot='start'>
                                <div className='icon-container'>
                                    {getIcon(group.icon)}
                                </div>
                            </IonThumbnail>
                            <div>
                                <IonLabel>{group.title}</IonLabel>
                                <div className='group-item-date'>{parseDate(group.createdAt).format('LLL')}</div>
                            </div>
                            <IonRippleEffect />
                        </div>
                        <div className='group-item-action'>
                            <IonButton fill='clear' onClick={(e) => onOptionClick(group)}>
                                <IonIcon icon={ellipsisVerticalOutline} />
                            </IonButton>
                        </div>
                    </div>
                ))
            }
            <GroupModal group={currentGroup} state={groupModal} setState={setGroupModal} />
        </AppLayout>
    );
}