import React from 'react';
import './index.css';
import { Table, PageHeader, Input, Typography } from 'antd';
import qs from 'qs';

const {Search} = Input;

class PeopleSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        data: null,
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false
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
    // TO DO: fetch people based on search query
    // fetch(`/friends/${this.props.userId}`)
    // .then(res => res.json())
    // .then(data => {
    //   // TODO: this needs to be integrated to the table
    //   console.log(data);
    //   this.setState({loading: false, data: data});
    // })

  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="People Search"
                extra={[    
                    <Search allowClear onSearch={() => console.log("hello")} style={{ width: 200 }} />,
                ]}
            />
            <Table
              columns={this.personColumns}
              rowKey={record => record.login.uuid}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default PeopleSearch;