import { addOutline } from 'ionicons/icons';
import { AppLayout } from '../../components';
import './Groups.css';
import { GroupModal } from '../../components/modals/group-modal/GroupModal';
import { useState } from 'react';
import useGroupStore from '../../store/group/group.store';
import { Group } from '../../models';
import { IonItem, IonLabel, IonThumbnail, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { GROUP_ICON_LIST } from '../../constants';

interface GroupsProps { }

export const Groups: React.FC<GroupsProps> = () => {
    const [groupModal, setGroupModal] = useState(false);
    const navigate = useIonRouter();
    const { groupList, setGroup, resetCurrentGroup } = useGroupStore(({ groupList, setGroup, resetCurrentGroup }) => ({ groupList, setGroup, resetCurrentGroup }));
    const btns = [
        {
            icon: addOutline,
            handler: () => {
                setGroupModal(true);
            }
        }
    ];

    const getIcon = (key: string) => {
        return GROUP_ICON_LIST.find(groupIcon => groupIcon.key === key)?.icon();
    }

    const onGroupItemClick = (group: Group) => {
        setGroup(group);
        navigate.push('/expense-breakdown');
    }

    useIonViewDidEnter(() => {
        resetCurrentGroup();
    }, []);

    return (
        <AppLayout basePage title="List" customBtns={btns}>
            {
                groupList.map((group: Group, index) => (
                    <IonItem key={`groupItem${group.id}${index}`} onClick={() => onGroupItemClick(group)}>
                        <IonThumbnail slot='start'>
                            <div className='icon-container'>
                                {getIcon(group.icon)}
                            </div>
                        </IonThumbnail>
                        <IonLabel>{group.title}</IonLabel>
                    </IonItem>
                ))
            }
            <GroupModal state={groupModal} setState={setGroupModal} />
        </AppLayout>
    );
}