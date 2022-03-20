import React from 'react';
import './index.css';
import { Table, PageHeader, Input } from 'antd';

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
      render: (record) => 
      <a onClick={() => this.props.viewProfile(record.userId)}>
        {record.firstName} {record.lastName}
      </a>,
      width: '50%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      with: '50%'
    },
  ];

  fetchUsers = (value) => {
    this.setState({ loading: true });
    var payload = JSON.stringify({
      search: value,
    });


    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    fetch(`/searchUser`, requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({ loading: false, data: data.users});
    });

  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="People Search"
                extra={[    
                    <Search allowClear onSearch={value => this.fetchUsers(value)} style={{ width: 200 }} />,
                ]}
            />
            <Table
              columns={this.personColumns}
              rowKey={record => record.userId}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default PeopleSearch;