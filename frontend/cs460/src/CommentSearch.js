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

  fetch = (params = {}) => {
    this.setState({ loading: true });
    // To do: search by comment
    // fetch(`/friends/${this.props.userId}`)
    // .then(res => res.json())
    // .then(data => {
    //   // TODO: this needs to be integrated to the table
    //   console.log(data);
    //   this.setState({loading: false, data: data});
    //})

  };

  render() {
    const { comments, loading, commentCount } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Comment Search"
                extra={[    
                    <Search allowClear onSearch={() => console.log("hello")} style={{ width: 200 }} />,
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