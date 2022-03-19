import React from 'react';
import './App.css';
import { PageHeader, Image, Input, Modal, Tooltip, Form, List, Button, Comment, Upload } from 'antd';
import qs from 'qs';
import {
    LikeOutlined
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

class ExternalAlbumPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
      images: [
        // 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        // 'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        // 'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        // 'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
        // 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        // 'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        // 'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        // 'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg','https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
        // 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        // 'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        // 'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        // 'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
        // 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        // 'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        // 'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        
      ],
      previewVisible: false,
      viewingImage: {
        previewImage: null,
        caption: "temp",
        likes: 0,
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
    this.fetch(this.props.albumId);
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  handleFriendStatusChange = isFriend => {
    // To do: access database and add/remove friend based on isFriend status
    this.setState({isFriend: !isFriend})
  }

  handlePreview = async file => {
    const { viewingImage } = this.state;
    if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  console.log(file)

    this.setState({
      viewingImage: {
        ...viewingImage,
        previewImage: file.url || file.preview,
      },
      previewVisible: true,
    });
    this.fetchComments(file.photoId);
  };

  handleCancel = () => this.setState({ previewVisible: false })

  fetch = (albumId) => {
    this.setState({ loading: true });
    // To do: Get albums associated with the user
    fetch(`/albumPhotos/${albumId}`)
      .then(result => { 
        var res = result.json(); 
        res.then( data => {
            if (data.err) { console.log(data.err); return; }
            // TODO : maybe do something with this data
            this.setState({images: data.photos});
        });
    });
  };

  fetchComments = (photoId) => {
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
    const {viewingImage} = this.state;
    var payload = JSON.stringify({
      photoId: viewingImage.photoId,
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
      console.log(data);
      const { viewingImage } = this.state;
      this.setState({
        viewingImage: {
          ...viewingImage,
          likes: data.likes.length,
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
      photoId: this.state.viewingImage.photoId,
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


  render() {
    const { images, viewingImage, previewVisible } = this.state;
    const { caption, likes, comments, newComment, previewImage } = viewingImage;
    const props = {
      listType: "picture-card",
        fileList: images,
        showUploadList:{
        showRemoveIcon: false
      }
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title={this.props.albumName}
            />
            {images ? <Upload onPreview={this.handlePreview}
              {...props}
            /> : null}
            <Modal
                visible={previewVisible}
                onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
              <Tooltip key="comment-basic-like" title="Like">
                <span onClick={() => this.addLike(likes)}>
                  <LikeOutlined/>
                  <span className="comment-action">{likes}</span>
                </span>
              </Tooltip>
              <p>{caption}</p>
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

export default ExternalAlbumPage;