import React from 'react';
import './index.css';
import { Table, PageHeader, Input, Typography, Image, Modal, Tooltip, List, Comment, Form, Button, Switch, Upload } from 'antd';
import {
    LikeOutlined, 
    SearchOutlined
  } from '@ant-design/icons';
import qs from 'qs';

const { Title } = Typography;
const { Search, TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class TagSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        data: null,
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false,
        previewVisible: false,
        previewTitle: null,
        searchOnlyMyPhotos: false,
        loading: false,
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
 
  personColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (name, record) => 
      <a onClick={() => this.props.viewProfile({
        firstName: name.first,
        lastName: name.last,
        email: record.email,
        hometown: record.location.city,
        dateOfBirth: record.dob,
        gender: record.gender,
        isFriend: true})}>
        {name.first} {name.last}
      </a>,
      width: '20%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log(file);
    const { viewingImage } = this.state;
    this.setState({
      
      previewImageCaption: file.caption,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      viewingImage: {
        ...viewingImage,
        likes: file.likes, 
        photoId: file.photoId,
        photoTags: file.tags,
        previewImage: file.url || file.preview,
      }
    });
    // fetch the comments
    fetch(`/comments/${file.photoId}`)
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
};

handleCancel = () => this.setState({ previewVisible: false });

  fetchPhotos = (values) => {
    this.setState({ loading: true, images: [] });
    const tagsArray = values.split(' ');
    this.setState({ loading: true });
    var payload = JSON.stringify({
      tags: tagsArray,
    });


    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    fetch(`/searchTags`, requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // To do: filter if only users photos
      this.setState({ loading: false, images: data.photos});
    });

  };

  render() {
    const { images, viewingImage, previewVisible, loading, searchOnlyMyPhotos } = this.state;
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
                title="Tag Search"
                extra={[
                      <Switch
                        checked={searchOnlyMyPhotos}
                        checkedChildren="My Photos"
                        unCheckedChildren="All Photos"
                        onChange={() => this.setState({searchOnlyMyPhotos: !searchOnlyMyPhotos})}
                      />,    
                    <Search allowClear onSearch={values => this.fetchPhotos(values)} style={{ "padding-left": 10, width: 200 }} />,  
                ]}
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

export default TagSearch;