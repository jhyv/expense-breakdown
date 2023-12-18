import { IonAvatar, IonContent, IonHeader, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useState } from 'react';
import { fetchUserList } from '../api/users';

const Home: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response: any = await fetchUserList();
    console.log(response.data);
    setUsers(response.data.results)
  }

  const removeUser = (user: any) => {
    setUsers([...users.filter((item: any) => item?.id?.value != user?.id?.value)]);
  }

  const showConfirmRemoveUser = (user: any) => {
    presentAlert({
      header: 'Remove User',
      message: `Are you sure you want to remove ${user?.name?.first} ${user?.name?.last} from list?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => removeUser(user)
        }
      ],
    })
  }

  const UserItem = ({ user }: any) => {
    return (
      <IonItemSliding>
        <IonItem>
          <IonAvatar slot='start'>
            <img src={user?.picture?.thumbnail} alt="" />
          </IonAvatar>
          <IonLabel>
            {user?.name?.first} {user?.name?.last}
          </IonLabel>
        </IonItem>

        <IonItemOptions>
          <IonItemOption color="danger" onClick={showConfirmRemoveUser}>Delete</IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Random Users</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Random Users</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {
            users.map((user: any, index: number) => {
              return (<UserItem user={user} key={`userItemComp${user?.id?.name}${index}`} />)
            })
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
