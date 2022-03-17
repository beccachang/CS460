import React from 'react';
import './App.css';
import { PageHeader, Button, Modal, Upload, Input, Form, Comment, List, Tooltip } from 'antd';
import {
    PlusOutlined,
    LikeOutlined,
  } from '@ant-design/icons';

const { TextArea } = Input;

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
        fileList: [],
        viewingImage : {
          likes: 5,
          newComment: "",
          comments: [
            {
              author: 'Random User',
              avatar: 'https://joeschmoe.io/api/v1/random',
              content: (
                <p>
                  Cute!
                </p>
              ),
            },
            {
              author: 'Random User',
              avatar: 'https://joeschmoe.io/api/v1/random',
              content: (
                <p>
                  What animal is this?
                </p>
              ),
  
            },
          ]
        }
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
          console.log("album imgs", data);
          this.setState({fileList: data.photos});
        });
  };

  fetchComments = (photoId) => {
    // To do: get comments to display when modal opens 
  }

  addLike = likes => {
    // To do: backend call to add likes
    const { viewingImage } = this.state;
    this.setState({
      viewingImage: {
        ...viewingImage,
        likes: likes + 1,
      }
    })
  }

  createNewComment = () => {
    const { viewingImage } = this.state;
    var { comments, newComment } = viewingImage;
    let updatedComments = comments.concat(
      [{
        author: 'Random User',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
          <p>
            {newComment}
          </p>
        ),
    }]);
    this.setState({
      viewingImage: {
        ...viewingImage,
        newComment: "",
        comments: updatedComments
      }
    })
    // to do: backend call to add comment to db
  }

  render() {
    const { modalOpen, fileList, previewImage, previewImageCaption, previewTitle, previewVisible, newPhoto, tags, caption, viewingImage } = this.state;
    const { likes, comments, newComment } = viewingImage;
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
              <Tooltip key="comment-basic-like" title="Like">
                <span onClick={() => this.addLike(likes)}>
                  <LikeOutlined/>
                  <span className="comment-action">{likes}</span>
                </span>
              </Tooltip>
              <p>{previewImageCaption}</p>
              <>
                <Form.Item>
                  <TextArea 
                    rows={1} 
                    onChange={ e => {
                      this.setState({
                        viewingImage: {
                          ...viewingImage,
                          newComment: e.target.value
                        }
                      })
                    }} 
                    value={newComment} 
                  />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" onClick={() => this.createNewComment()} type="primary">
                    Add Comment
                  </Button>
                </Form.Item>
              </>
              <List
                className="comment-list"
                header={`${comments.length} replies`}
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={item => (
                  <li>
                    <Comment
                      author={item.author}
                      avatar={item.avatar}
                      content={item.content}
                    />
                  </li>
                )}
              />
            </Modal>
        </div>
    );
  }
}

export default UserAlbumPage;