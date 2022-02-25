import React from 'react';
import './App.css';
import { Table, PageHeader, Image, Input, Popover } from 'antd';
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
        
      ]
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
    const {images} = this.state;
    const split = images.length/4;
    const column1 = images.slice(0, split).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
        />)
    const column2 = images.slice(split, 2*split).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
        />)
    const column3 = images.slice(2*split, 3*split).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
        />)
    const column4 = images.slice(3*split, images.length).map((url) => 
        <Image
            key={url}
            width={200}
            src={url}
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

            
        </div>
      
    );
  }
}

export default ExternalAlbumPage;