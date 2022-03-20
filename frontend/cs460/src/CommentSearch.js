import React from 'react';
import './index.css';
import { Table, PageHeader, Input, Typography, Comment, List } from 'antd';
import qs from 'qs';

const { Title } = Typography;
const {Search} = Input;

class CommentSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        comments: [],
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false,
        commentCount: null
    };
  }

  fetchComments = value => {
    this.setState({ loading: true });
    var payload = JSON.stringify({
      comment: value,
    });


    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    fetch(`/searchComments`, requestOptions)
    .then(res => res.json())
    .then(data => {
      this.setState({ loading: false, comments: data.comments});
    });

  };

  visitProfilePage = (userId) => {
    this.setState({
      showingPage: 'profile', 
      externalUserId: userId
    });
  }


  render() {
    const { comments, loading, } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Comment Search"
                extra={[    
                    <Search allowClear onSearch={value => this.fetchComments(value)} style={{ width: 200 }} />,
                ]}
            />
            <List
                className="comment-list"
                header={`${comments.length} comments`}
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={item => (
<<<<<<< HEAD
                  <li>
                    <Comment
                      author={item.author}
                      avatar={item.avatar}
                      content={item.content}
=======
                <li>
                    <Comment onClick={this.visitProfilePage(item.userId)}
                    author={item.author}
                    avatar={item.avatar}
                    content={item.content}
>>>>>>> 4a6ac39cbf77cf03efce920a47a7b90a4244d5a2
                    />
                  </li>
                )}
              />
        </div>
      
    );
  }
}

export default CommentSearch;