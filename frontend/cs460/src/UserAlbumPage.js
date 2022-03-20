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
          likes: 0,
          userLikes: [], // array with user info about who liked the post 
          newComment: "",
          photoId: "",
          comments: [],
          photoTags: [],
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

        const { viewingImage } = this.state;
        this.setState({
          previewImage: file.url || file.preview,
          previewImageCaption: file.caption,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
          viewingImage: {
            ...viewingImage,
            likes: file.likes.totalQnty, 
            userLikes: file.likes.users,
            photoId: file.photoId,
            photoTags: file.tags
          }
        });
        // fetch the comments
        this.fetchComments(file.photoId);
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handleChange = ({ fileList }) => this.setState({ fileList });

    handleCaptionChange = event => {
            this.setState({caption: event.target.value})
    }

    handleTagChange = event => {
        const list = event.target.value.split(" ");
        this.setState({tags: list})
    }

    uploadImage = async event => {
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
              this.setState({ loading: false, fileList: data.photos, modalOpen: false});

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
          if (data.err) { console.log(data.err); return; }
          this.setState({ loading: false, fileList: data.photos});
        });
  };

  fetchComments = (photoId) => {
    // To do: get comments to display when modal opens 
    // VIVIEN: Endpoint is /comments/<int:photo_id> 
    fetch(`/comments/${photoId}`)
      .then(res => res.json())
      .then(data => {
        console.log("comments", data);
        // set comments here 
        const { viewingImage } = this.state;
        this.setState({
          viewingImage: {
            ...viewingImage,
            comments: data.comments
          }
        });
      }); 
  }

  addLike = likes => {
    var payload = JSON.stringify({
     photoId: this.state.viewingImage.photoId,
      userId: this.props.userId
    });

    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    fetch(`/newLike`, requestOptions)
    .then(res => res.json())
    .then(data => {
      const { viewingImage } = this.state;
      this.setState({
        viewingImage: {
          ...viewingImage,
          likes: data.likes.totalQnty,
          userLikes: data.likes.users 
        }
      })
    });
  }

  createNewComment = () => {
    const { viewingImage } = this.state;
    var { comments, newComment } = viewingImage;

    // to do: backend call to add comment to db
    var payload = JSON.stringify({
      photoId: viewingImage.photoId,
      userId: this.props.userId,
      comment: newComment
    });


    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    fetch(`/newComment`, requestOptions)
    .then(res => res.json())
    .then(data => {
      this.setState({
        viewingImage: {
          ...viewingImage,
          newComment: "",
          comments: data.comments
        }
      })
    });

  }

  handleDelete = e => {
    var payload = JSON.stringify({
      photoId: e.photoId,
    });

    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    fetch(`/deletePhoto`, requestOptions)
    .then(res => res.json())
    .then(() => {
      console.log('photo deleted')
    });
  }

  render() {
    const { modalOpen, fileList, previewImage, previewImageCaption, previewTitle, previewVisible, newPhoto, tags, caption, viewingImage } = this.state;
    const { likes, comments, photoTags, newComment } = viewingImage;
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
                onRemove={this.handleDelete}
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
              <div>
                <p>{"Tags: "}</p>
                {photoTags.map(tag => <a key={tag} onClick={()=>this.props.makeTagQuery(tag)}>{tag}&nbsp;</a>)}
              </div>
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