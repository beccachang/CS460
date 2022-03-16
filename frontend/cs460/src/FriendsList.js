import React from 'react';
import './index.css';
import { Table, PageHeader, Input, Typography } from 'antd';
import qs from 'qs';

const { Title } = Typography;
const {Search} = Input;

const getRandomuserParams = params => ({
  results: params.pagination.pageSize,
  page: params.pagination.current,
  ...params,
});

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
    };
  }
 
  friendsColumns = [
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
      console.log(data);
      this.setState({loading: false});
    })

    // fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params))}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({
    //       loading: false,
    //       data: data.results,
    //       pagination: {
    //         ...params.pagination,
    //         total: 200,
    //         // 200 is mock data, you should read it from server
    //         // total: data.totalCount,
    //       },
    //     });
    //   });
  };

  render() {
    const { data, pagination, loading } = this.state;
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
              rowKey={record => record.login.uuid}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}
              onClick={() =>console.log('hellowww')}/>
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