import React, { useEffect, useState } from 'react';
import { IonButton, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { fileApi } from '../api/file'



const Home: React.FC = () => {
  const { uploadFile, parseJson,uploadEmp } = fileApi();
  const [data, setData] = useState<any>([{}]);
  const [selectedEmp, setSelectedEmp] = useState<any>([{}]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [presentAlert] = useIonAlert();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile, selectedFile.name);
      const response = await uploadFile(formData);
      const result = response.data;
      const url = result.files[0].url;
      const csvFileUrl = url.slice(7, url.length)
      const res = await parseJson(csvFileUrl);
      setData([...res.data.slice(0, res.data.length - 1)])
    }
  }

  
  useEffect(()=>{
    setData([]);
    setSelectedEmp([]);
  },[])


  const onClickUpload=async()=>{
    if (selectedEmp.length >0) {
    presentAlert({
      header: 'Thông Báo',
      message: 'Bạn có chắc muốn Upload các nhân viên trên?!',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
  
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          onClickUploadButton()
        },
      },],
    })}
    else{
      presentAlert({
        header: 'Thông Báo',
        message: 'Bạn chưa chọn item nào!',
        buttons: ['OK'],
      })
    }
  }
  
  const onClickUploadButton = async () => {
    
    
      
      const today=new Date();
      const createDate=today.toISOString();

      let updatedEmps: any[] = [];
      let count = 0;
      for (let i = 0; i < selectedEmp.length; i++) {
        const item = selectedEmp[i];
        const dateString = item.DateOfBirth;
        const dateParts = dateString.split('/');
        const dateObject = new Date(Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]));
        const birthday = dateObject.toISOString();
        item.DateOfBirth = birthday;
        item.CreatedDate = createDate;
        item.UpdatedDate = createDate;
        
        const res = await uploadEmp(item);
        if(res)
        {
        setSelectedEmp(selectedEmp.filter((selectedEmp: any) => selectedEmp !== item))
        }
        if (res.status) {

          
          
          item.status = "Thành Công";
          updatedEmps = [
            ...updatedEmps.slice(0, count),
            {
              ...item
            },
            ...updatedEmps.slice(count + 1)
          ];
          count++;
        } else if (res.response.data.error.statusCode) {
          item.status = "Thất Bại";
          updatedEmps = [
            ...updatedEmps.slice(0, count),
            {
              ...item
            },
            ...updatedEmps.slice(count + 1)
          ];
          count++;
        } else {
          updatedEmps.push(item);
        }
      }
      const newEmps = selectedEmp.filter((_: any, index: string | number) => {
        const item = selectedEmp[index];
        return !updatedEmps.includes(item) && item.status !== "Thành Công";});
    setSelectedEmp(newEmps)   
    
  }

  const handleChangeCheckbox = (item: any) => {
    if (selectedEmp.includes(item)) {
      setSelectedEmp(selectedEmp.filter((selectedEmp: any) => selectedEmp !== item))
    }
    else {
      setSelectedEmp([...selectedEmp, item])
    }
  }
  

  return (
    <IonPage>
      <IonToolbar>

        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel>Select file</IonLabel>
            <input type="file" onChange={handleFileChange} />
          </IonItem>
          <IonButton type="submit">Upload</IonButton>
        </form>
      </IonToolbar>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size='5'></IonCol>
            <IonCol size='3'>Danh Sách Nhân Viên</IonCol>
            <IonCol size='2'></IonCol>
            <IonCol size='2'><IonButton onClick={() => {
          onClickUpload()
        }}>Xác Nhận</IonButton></IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='col'>
              Mã Nhân Viên
            </IonCol>
            <IonCol className='col'>
              Tên
            </IonCol>
            <IonCol className='col'>
              Ngày Sinh
            </IonCol>
            <IonCol className='col'>
              Địa Chỉ
            </IonCol>
            <IonCol className='col'>
              Nơi Sinh
            </IonCol>
            <IonCol className='col'>
              SĐT
            </IonCol>
            <IonCol className='col'>
              Email
            </IonCol>
            <IonCol className='col'>
              CheckAll
              <IonCheckbox
                checked={ data.length === selectedEmp.length}
                onIonChange={e => {
                  if (e.detail.checked) {
                    setSelectedEmp(data);
                  }
                  else {
                    setSelectedEmp([]);
                  }
                }}>

              </IonCheckbox>
            </IonCol>
            <IonCol className='col'>
              Trạng Thái
            </IonCol>
          </IonRow>
          { data.map((item: any) => {
            return (
              <IonRow key={item.id}>
                <IonCol className='col'>
                  {item.EmpId || ""}
                </IonCol>
                <IonCol className='col'>
                  {item.FullName || ""}
                </IonCol >
                <IonCol className='col'>
                  {item.DateOfBirth || ""}
                </IonCol>
                <IonCol className='col'>
                  {item.Address || ""}
                </IonCol>
                <IonCol className='col'>
                  {item.Birthplace || ""}
                </IonCol>
                <IonCol className='col'>
                  {item.PhoneNumber || ""}
                </IonCol>
                <IonCol className='col'>
                  {item.Email || ""}
                </IonCol>
                
                <IonCol className='col'>
                  {item.status!=='Thành Công'&&  <IonCheckbox
                   onIonChange={() => {
                    handleChangeCheckbox(item);
                  }}
                    checked={selectedEmp.includes(item)}>
                  </IonCheckbox>}
                 

                </IonCol>



                <IonCol className='col'>
                  {item.status || "Đang chờ"}
                </IonCol>
              </IonRow>
            )
          })}
        </IonGrid>
        <IonButton onClick={() => {
          onClickUpload()
        }}>Xác Nhận</IonButton>
      </IonContent>
    </IonPage>



  );
};

export default Home;
