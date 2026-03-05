import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../selectors';
import * as actions from '../actions';

import PostItem from './PostItem';
import {FilterComponent, Pager} from '../../common';

const PostSection = ({activeTab}) => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const feed = useSelector(selectors.getPostsFeed);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sortBy, setSortBy] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const postFilters = [
                    {"label": "Fecha", "value": "date"}, 
                    {"label": "Votos", "value": "votes"},
                    {"label": "Solventados", "value": "solved"},
                ]

    useEffect(() => {
        setPage(0);
    }, [activeTab]);

    useEffect(() => {
        dispatch(actions.getFeed(activeTab, page, size, sortBy, sortDirection));
    }, [activeTab, page, size, sortBy, sortDirection]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page, size, sortBy, sortDirection]);


    const handlePageSizeChange = (newSize) => {
        setSize(newSize)
        setPage(0) 
    }
                
    return (
        <div className="lg:w-5/8 w-full flex flex-col overflow-y-auto scroll-auto scroll no-scrollbar">
            <FilterComponent 
            filters={postFilters} 

            handleFilterChange={(field, direction) => {
                setSortBy(field);
                setSortDirection(direction);
                setPage(0);
            }} 
            onClear={
                () => {
                    setSortBy("date");
                    setSortDirection("desc");
                    setPage(0);
                }
            }
            />
            <div ref={scrollRef} className="lg:mt-2 p-4 lg:p-0 space-y-4">
                {
                    feed.length === 0 ? 
                        (<div className="text-gray-400 text-center py-8">No hay publicaciones en esta categoría</div>) 
                        : 
                        (feed.content.map((post) => <PostItem key={post.id} post={post} />))
                }
            
            <Pager
                page={page}
                totalPages={feed.totalPages}
                size={size}
                onPageChange={setPage}
                onSizeChange={handlePageSizeChange}
            />
            </div>
        </div>
    )
}

PostSection.protoTypes = {
    activeTab: PropTypes.number.isRequired
}

export default PostSection