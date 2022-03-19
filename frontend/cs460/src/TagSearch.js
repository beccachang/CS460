import React from 'react';
import './index.css';
import { Table, PageHeader, Input, Typography, Image, Modal, Tooltip, List, Comment, Form, Button } from 'antd';
import {
    LikeOutlined, 
    SearchOutlined
  } from '@ant-design/icons';
import qs from 'qs';

const { Title } = Typography;
const { Search, TextArea } = Input;

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

  fetch = (params = {}) => {
    this.setState({ loading: true });
    // TO DO: fetch tagged photos based on search query
    // fetch(`/friends/${this.props.userId}`)
    // .then(res => res.json())
    // .then(data => {
    //   // TODO: this needs to be integrated to the table
    //   console.log(data);
    //   this.setState({loading: false, data: data});
    // })

  };

  render() {
    const { images, viewingImage, previewVisible, loading } = this.state;
    const { caption, likes, comments, newComment, previewImage } = viewingImage;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Tag Search"
                extra={[    
                    <Search allowClear onSearch={() => console.log("hello")} style={{ width: 200 }} />,
                ]}
            />
            {images ? <List
                header={`${images.length} replies`}
                itemLayout="horizontal"
                dataSource={images}
                renderItem={image => (
                  <li>
                    <Image
                        key={image.url}
                        width={400}
                        src={image.url}
                        onClick={()=>console.log("open preview modal")}
                    />
                  </li>
                )}
              /> : 
              <List/>}
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