import React from 'react';
import './index.css';
import { PageHeader, Button, Modal, Upload, Input, Form } from 'antd';
import qs from 'qs';
import {
    PlusOutlined,
    UploadOutlined
  } from '@ant-design/icons';

const { TextArea } = Input;
const getRandomuserParams = params => ({
  results: params.pagination.pageSize,
  page: params.pagination.current,
  ...params,
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

class UserAlbumPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        albums: [],
        pagination: {
            current: 1,
            pageSize: 10,
        },
        caption: null,
        newPhoto: null, 
        tags: [],
        loading: false,
        modalOpen: false,
        previewVisible: false,
        previewImage: '',
        previewImageCaption: '',
        previewTitle: '',
        fileList: [
            // {
            //     uid: '-1',
            //     name: 'Kookaburra1',
            //     status: 'done',
            //     url: 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
            //     caption: 'Kookaburra on a perch.'
            // },
            // {
            //     uid: '-2',
            //     name: 'Kookaburra2',
            //     status: 'done',
            //     url: 'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
            //     caption: 'Kookaburra on a perch.'
            // },
            // {
            //     uid: '-3',
            //     name: 'Kookaburra3',
            //     status: 'done',
            //     url: 'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
            //     caption: 'Kookaburra on a perch.'
            // },
            // {
            //     uid: '-4',
            //     name: 'Kookaburra4',
            //     status: 'done',
            //     url: 'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
            //     caption: 'Kookaburra on a perch.'
            // },
        ],
    };
  }


    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
        });
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
          previewImage: file.url || file.preview,
          previewImageCaption: file.caption,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleCancel = () => this.setState({ previewVisible: false })

    handleChange = ({ fileList }) => this.setState({ fileList });

    handleCaptionChange = event => {
            this.setState({caption: event.target.value})
    }

    handleTagChange = event => {
        const list = event.target.value.split(" ");
        this.setState({tags: list})
    }

    uploadImage = async event => {
        // To do: action should be to upload image
        console.log(event)
        //const binaryPhoto = getBase64(event.file.originFileObj);
        const binaryPhoto = await getBase64(event.file);
        this.setState({newPhoto: binaryPhoto})
    }

    addNewImage = (newPhoto, tags, caption) => {
      var payload = JSON.stringify({
          email: this.props.username,
          albumId: this.props.album.id,
          caption: caption,
          data: newPhoto,
          tags: tags   
      })

      var requestOptions = {
          method: 'POST',
          body: payload,
          redirect: 'follow'
      };

      fetch("/newPhoto", requestOptions)
      .then(result => { 
          var res = result.json(); 
          console.log(result);
          res.then( data => {
              if (data.err) { console.log(data.err); return; }
              console.log(data);
          });
      })
      .catch(error => console.log('error', error));
    }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    // To do: Get photos for this album
    // VIVIEN: Here's my attempt at this 
    // endpoint is: /albumPhotos/<int:album_id> 
    fetch(`/albumPhotos/${this.props.album.id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
            //this.setState({fileList: data.photos});
        });
  };

  render() {
    const { modalOpen, fileList, previewImage, previewImageCaption, previewTitle, previewVisible,  image, newPhoto, tags, caption } = this.state;
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title={this.props.album.name} //'Album Name Here'
                extra={[    
                    <Button key="1" type="primary" icon={<PlusOutlined/> } onClick={() => this.setState({modalOpen: true})}>
                        Add Picture
                    </Button>
                ]}
            />
            <Modal title="Add New Photo" visible={modalOpen} onOk={ () => this.addNewImage(newPhoto, tags, caption)} onCancel={() => this.setState({modalOpen: false})}>
                <Upload onChange={event=>this.uploadImage(event)} beforeUpload={file => {this.setState({file: file}); return false;}} action={null} listType="picture-card" maxCount={1}> {uploadButton}</Upload>
                <TextArea showCount placeholder="Add a caption" maxLength={255} onChange={e => this.handleCaptionChange(e)}/>
                {/* tags as a list of words separated by spaces */}
                <TextArea showCount placeholder="Add tags" maxLength={255} onChange={ e => this.handleTagChange(e) }/>
            </Modal>
            <Upload
                
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
            >
                {null}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={this.handleCancel}
            >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
            <p>{previewImageCaption}</p>
            </Modal>
        </div>
    );
  }
}

export default UserAlbumPage;