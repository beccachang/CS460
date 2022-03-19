import React from 'react';
import './index.css';
import { Table, PageHeader, Button, Input, Popover } from 'antd';
import qs from 'qs';
import {
    PlusOutlined,
    MinusOutlined
  } from '@ant-design/icons';

const getRandomuserParams = params => ({
  results: params.pagination.pageSize,
  page: params.pagination.current,
  ...params,
});

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
      isFriend: props.profile.isFriend
    };
  }
  
  columns = [
    {
      title: 'Albums',
      dataIndex: 'name',
      sorter: true,
      render: name => <a onClick={()=> this.props.visitExternalAlbumPage()}>{name.first} {name.last}</a>,
      width: '20%',
    },
    {
      title: 'Creation Date',
      dataIndex: ['dob', 'date'],
      width: '20%',
    },
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

  handleFriendStatusChange = isFriend => {
    if (isFriend) {
      var payload = JSON.stringify({
        userId: this.props.userId,
			  friendUserId: this.props.loadedProfile.userId
      });
  
  
      var requestOptions = {
          method: 'POST',
          body: payload,
          redirect: 'follow'
      };
  
      fetch(`/addFriend`, requestOptions)
      .then(res => res.json())
      .then(data => {
        this.setState({isFriend: !isFriend})
      });
    } else {
      var payload = JSON.stringify({
        userId: this.props.userId,
			  friendUserId: this.props.loadedProfile.userId
      });
  
  
      var requestOptions = {
          method: 'POST',
          body: payload,
          redirect: 'follow'
      };
  
      fetch(`/removeFriend`, requestOptions)
      .then(res => res.json())
      .then(data => {
        this.setState({isFriend: !isFriend})
      });
    }
    
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    // To do: Get albums associated with the user
    fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params))}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          loading: false,
          albums: data.results,
          pagination: {
            ...params.pagination,
            total: data.totalCount,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  render() {
    const { albums, pagination, loading, isFriend } = this.state;
    const {firstName, lastName} = this.props.profile;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title={firstName + ' ' + lastName}
                extra={[    
                    <Button key="1" type="primary" icon={isFriend ? <MinusOutlined/> : <PlusOutlined/> } onClick={() => this.handleFriendStatusChange(isFriend)}>
                        {isFriend ? 'Remove Friend': 'Add Friend' }
                    </Button>
                ]}
            />
            <Table
            columns={this.columns}
            rowKey={record => record.login.uuid}
            dataSource={albums}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default Profile;