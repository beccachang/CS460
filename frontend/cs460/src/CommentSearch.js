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
        comments: null,
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
      console.log(data);
      //this.setState({ loading: false, data: data.comments});
    });

  };

  render() {
    const { comments, loading, commentCount } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Comment Search"
                extra={[    
                    <Search allowClear onSearch={value => this.fetchComments(value)} style={{ width: 200 }} />,
                ]}
            />
            {comments ? 
                <List
                className="comment-list"
                header={commentCount ? `${commentCount} comments found` : null}
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
            /> :
                <List/>
            }
            
        </div>
      
    );
  }
}

export default CommentSearch;