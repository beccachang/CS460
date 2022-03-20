import React from 'react';
import './App.css';
import { Button, Modal, Upload, Input, Form, Comment, List, Tooltip, Typography } from 'antd';
import {
  LikeOutlined,
} from '@ant-design/icons';
import { Table } from 'antd';
const { Title } = Typography;


const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Feed extends React.Component {
  constructor(props) {
    super(props);
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
      viewingImage: {
        likes: 0,
        userLikes: [], // array with user info about who liked the post 
        newComment: "",
        photoId: "",
        comments: [],
        photoTags: [],
      },
      tagData: [],
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
    };
  }

  personColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (name, record) => 
      <a onClick={() => this.props.viewProfile(record.userId)}>
        {record.firstName} {record.lastName}
      </a>,
      width: '50%',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      with: '50%'
    },
  ];

  tagColumns = [
    {
      title: 'Name', 
      dataIndex: 'name',
      width:'50%'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '50%'
    }
  ];

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
    this.setState({ caption: event.target.value })
  }

  handleTagChange = event => {
    const list = event.target.value.split(" ");
    this.setState({ tags: list })
  }

  uploadImage = async event => {
    const binaryPhoto = await getBase64(event.file);
    this.setState({ newPhoto: binaryPhoto })
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
        res.then(data => {
          if (data.err) { console.log(data.err); return; }
          this.setState({ loading: false, fileList: data.photos, modalOpen: false });

        });
      })
      .catch(error => console.log('error', error));
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    // To do: Get recommended photos 
    // VIVIEN: Here's my attempt at this 
    // endpoint is: /albumPhotos/<int:album_id> 
    var userId;
    if (!this.props.userId) userId = 0;
    else userId = this.props.userId;
    fetch(`/suggestedPhotos/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("album imgs", data);
        if (data.err) { console.log(data.err); return; }
        this.setState({ loading: false, fileList: data.photos });
      });
    
    fetch(`/topUsers`)
    .then(res => res.json())
    .then(data => {
      this.setState({ loading: false, data: data.users});
    })

    fetch(`/topTags`)
    .then(res => res.json())
    .then(data => {
      this.setState({ loading: false, tagData: data.tags })
    })
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

  createNewComment = (photoID) => {
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
    const { fileList, previewImage, previewImageCaption, previewTitle, previewVisible, viewingImage } = this.state;
    const { likes, comments, photoTags, newComment } = viewingImage;
    const { tagData, data, tagPagination, pagination, loading } = this.state;
    const props = {
      listType: "picture-card",
        fileList: fileList,
        showUploadList:{
        showRemoveIcon: false
      }
    }
    return (
      <div>
        <Title level={4}> You May Like </Title>
        <Upload onPreview={this.handlePreview}
              {...props}
            />
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
          <Tooltip key="comment-basic-like" title="Like">
            <span onClick={() => this.addLike(likes)}>
              <LikeOutlined />
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
                onChange={e => {
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
        <Title level={4}> Top Users </Title>
        <Table
              columns={this.personColumns}
              rowKey={record => record.userId}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>

        <Title level={4}> Top Tags </Title>
        <Table
              columns={this.tagColumns}
              dataSource={tagData}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>
      </div>
    );
  }
}

export default Feed;