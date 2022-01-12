import React,{useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

//document.title = `${capitalizeFirstLetter(props.category)} - SeeNEWS`;
const News =(props)=> {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

   const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const  updateNews =async()=> {
        props.setProgress(30);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a369c8faaf86434982782c9146b91c0b&page=${page}&pageSize=${props.pageSize}`;
        
        setLoading(true)
        let data = await fetch(url);
        let parsedData = await data.json();
        props.setProgress(60);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)

        props.setProgress(100);
    }


    useEffect(() => {
        updateNews();
        //eslint-disable-next-line
    }, [])


 
  const  fetchMoreData = async () => {
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a369c8faaf86434982782c9146b91c0b&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page +1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };
    
        return (

            <>
                <h1 className="text-center" style={{marginTop:'80px'}}>SeeNEWS - Top Headlines in {capitalizeFirstLetter(props.category)} catgory.</h1>
                {loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                >
                    <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description.slice(0.90) : " "} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}

                    </div>
                    </div>
                    
                </InfiniteScroll>
                

            </>
        )
    
}

News.defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'general',
    totalResults : 0

}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}
export default News
