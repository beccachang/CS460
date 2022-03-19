import React from 'react';
import './App.css';
import { PageHeader, Image, Input, Modal, Tooltip, Form, List, Button, Comment } from 'antd';
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
        'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
        'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg','https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
        'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        'https://www.equilibriumx.com/wp-content/uploads/2021/09/kokaburra-3-1.jpg',
        'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/australia/Laughing-Kookaburra_Patrick-Rolands.jpg?crop=0,0,4000,2200&wid=4000&hei=2200&scl=1.0',
        'https://www.marylandzoo.org/wp-content/uploads/2017/08/kookabura_web-1024x683.jpg',
        'https://media.australian.museum/media/dd/images/laughing_kookaburra.6d35e2f.width-800.2088cd5.jpg',
        
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

  handleFriendStatusChange = isFriend => {
    // To do: access database and add/remove friend based on isFriend status
    this.setState({isFriend: !isFriend})
  }

  handlePreview = async file => {
    const { viewingImage } = this.state;
    if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }

    this.setState({
      viewingImage: {
        ...viewingImage,
        previewImage: file.url || file.preview,
      },
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false })

  fetch = (params = {}) => {
    this.setState({ loading: true });
    // To do: Get albums associated with the user

    // VIVIEN: Here's my shot at doing that :) 
    // the endpoint is /albums/<int:user_id> 
    fetch(`/albums/${qs.stringify(this.props.userId)}`)
      .then(result => { 
        var res = result.json(); 
        res.then( data => {
            if (data.err) { console.log(data.err); return; }
            // TODO : maybe do something with this data
            console.log(data.data);
        });
    });

    // fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params))}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({
    //       loading: false,
    //       albums: data.results,
    //       pagination: {
    //         ...params.pagination,
    //         total: data.totalCount,
    //         // 200 is mock data, you should read it from server
    //         // total: data.totalCount,
    //       },
    //     });
    //   });
  };

  render() {
    const { images, viewingImage, previewVisible } = this.state;
    const { caption, likes, comments, newComment, previewImage } = viewingImage;
    const split = images.length/4;
    const column1 = images.slice(0, split).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
            onClick={()=>console.log("open preview modal")}
        />)
    const column2 = images.slice(split, 2*split).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
            onClick={()=>console.log("open preview modal")}
        />)
    const column3 = images.slice(2*split, 3*split).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
            onClick={()=>console.log("open preview modal")}
        />)
    const column4 = images.slice(3*split, images.length).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
            onClick={()=>console.log("open preview modal")}
        />)
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title='External Album Page'
            />
            <div class='row'>
                <div class='column'> { column1 } </div>
                <div class='column'> { column2 } </div>
                <div class='column'> { column3 } </div>
                <div class='column'> { column4 } </div>
            </div>
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