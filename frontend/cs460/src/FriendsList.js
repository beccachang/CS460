import React from 'react';
import './index.css';
import { Table, PageHeader, Input, Typography } from 'antd';

const { Title } = Typography;
const {Search} = Input;

class FriendsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
      friends: [],
      suggestedFriendsColumns: []
    };
  }
 
  friendsColumns = [
    {
      title: 'Name',
      sorter: true,
      render: (record) => 
      <a onClick={() => this.props.viewProfile(record.userId)}>
        {record.firstName} {record.lastName}
      </a>,
      width: '20%',
    },
  ];

  suggestedFriendsColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (name, record) => 
      <a onClick={() => this.props.pageChange({
        firstName: name.first,
        lastName: name.last,
        email: record.email,
        hometown: record.location.city,
        dateOfBirth: record.dob,
        gender: record.gender,
        isFriend: false})}>
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

  fetch = (params = {}) => {
    // To do: get friends for user
    // To do: get suggested friends for user
    this.setState({ loading: true });

    // VIVIEN: User's friends 
    // endpoint is /friends/<int:user_id>
    fetch(`/friends/${this.props.userId}`)
    .then(res => res.json())
    .then(data => {
      // TODO: this needs to be integrated to the table
      console.log(data.friends);
      this.setState({loading: false, friends: data.friends});
    })
  };

  render() {
    const { data, pagination, loading, friends } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="My Friends"
                extra={[    
                    // To do: filter table data based on search term
                    <Search placeholder="Search Friends" allowClear onSearch={() => console.log("hello")} style={{ width: 200 }} />,
                ]}
            />
            <Table
              columns={this.friendsColumns}
              rowKey={record => record.userId}
              dataSource={friends}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>
            <Title level={4}> Suggested Friends </Title>
            <Table
              columns={this.suggestedFriendsColumns}
              rowKey={record => record.login.uuid}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default FriendsList;