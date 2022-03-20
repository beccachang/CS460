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
      isFriend: false,
      firstName: "",
      lastName: "",
    };
  }
  
  columns = [
    {
      title: 'Albums',
      sorter: true,
      render: record => <a onClick={() => this.props.visitExternalAlbumPage(record.id, record.name)}>{record.name}</a>,
      width: '20%',
    },
  ];

  componentDidMount() {
    this.fetchProfile(this.props.profileUserId);
    this.fetchAlbums(this.props.profileUserId);
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

  fetchProfile = userId => {
    this.setState({loading: true})
    fetch(`/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({
          firstName: data.firstName,
          lastName: data.lastName,
          albums: data.albums,
        })
      });
  }

  fetchAlbums = userId => {
    fetch(`/albums/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({albums: data.albums, loading: false})
      });
  }
  render() {
    const { albums, pagination, loading, isFriend, firstName, lastName } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title={firstName + ' ' + lastName}
                extra={[    
                    <Button disabled={this.props.guest} key="1" type="primary" icon={isFriend ? <MinusOutlined/> : <PlusOutlined/> } onClick={() => this.handleFriendStatusChange(isFriend)}>
                        {isFriend ? 'Remove Friend': 'Add Friend' }
                    </Button>
                ]}
            /> 
            <Table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={albums}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default Profile;